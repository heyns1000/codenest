/**
 * ClaimRoot™ - Governance Layer
 * Decentralized governance and claim management system
 */

export class ClaimRoot {
  constructor() {
    this.claims = new Map();
    this.validators = new Set();
    this.proposals = new Map();
    this.votingPower = new Map();
  }

  registerValidator(validatorId, stake) {
    this.validators.add(validatorId);
    this.votingPower.set(validatorId, stake);
    return true;
  }

  submitClaim(claimData) {
    const claimId = `CLAIM_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const claim = {
      id: claimId,
      ...claimData,
      status: 'PENDING',
      submittedAt: Date.now(),
      votes: new Map(),
      validations: []
    };

    this.claims.set(claimId, claim);
    return claim;
  }

  validateClaim(claimId, validatorId, decision, reason = '') {
    const claim = this.claims.get(claimId);
    if (!claim) {
      throw new Error(`Claim ${claimId} not found`);
    }

    if (!this.validators.has(validatorId)) {
      throw new Error(`Validator ${validatorId} not registered`);
    }

    claim.validations.push({
      validator: validatorId,
      decision,
      reason,
      timestamp: Date.now(),
      votingPower: this.votingPower.get(validatorId) || 1
    });

    // Auto-resolve if enough validations
    if (claim.validations.length >= 3) {
      this.resolveClaim(claimId);
    }

    return claim;
  }

  resolveClaim(claimId) {
    const claim = this.claims.get(claimId);
    if (!claim) {
      throw new Error(`Claim ${claimId} not found`);
    }

    const approvals = claim.validations.filter(v => v.decision === 'APPROVE');
    const rejections = claim.validations.filter(v => v.decision === 'REJECT');

    const approvalPower = approvals.reduce((sum, v) => sum + v.votingPower, 0);
    const rejectionPower = rejections.reduce((sum, v) => sum + v.votingPower, 0);

    claim.status = approvalPower > rejectionPower ? 'APPROVED' : 'REJECTED';
    claim.resolvedAt = Date.now();
    claim.finalVote = { approvalPower, rejectionPower };

    return claim;
  }

  createProposal(proposalData) {
    const proposalId = `PROP_${Date.now()}`;
    
    const proposal = {
      id: proposalId,
      ...proposalData,
      status: 'ACTIVE',
      createdAt: Date.now(),
      votes: new Map(),
      votingEnds: Date.now() + (proposalData.duration || 7 * 24 * 60 * 60 * 1000) // 7 days default
    };

    this.proposals.set(proposalId, proposal);
    return proposal;
  }

  vote(proposalId, validatorId, vote) {
    const proposal = this.proposals.get(proposalId);
    if (!proposal) {
      throw new Error(`Proposal ${proposalId} not found`);
    }

    if (!this.validators.has(validatorId)) {
      throw new Error(`Validator ${validatorId} not registered`);
    }

    if (Date.now() > proposal.votingEnds) {
      throw new Error('Voting period has ended');
    }

    const votingPower = this.votingPower.get(validatorId) || 1;
    proposal.votes.set(validatorId, { vote, votingPower, timestamp: Date.now() });

    return proposal;
  }

  getProposalResults(proposalId) {
    const proposal = this.proposals.get(proposalId);
    if (!proposal) {
      throw new Error(`Proposal ${proposalId} not found`);
    }

    let forVotes = 0;
    let againstVotes = 0;

    proposal.votes.forEach(({ vote, votingPower }) => {
      if (vote === 'FOR') forVotes += votingPower;
      else if (vote === 'AGAINST') againstVotes += votingPower;
    });

    return {
      proposalId,
      forVotes,
      againstVotes,
      totalVotes: proposal.votes.size,
      status: proposal.status,
      votingEnds: proposal.votingEnds
    };
  }

  getGovernanceStats() {
    return {
      validators: this.validators.size,
      claims: this.claims.size,
      proposals: this.proposals.size,
      pendingClaims: Array.from(this.claims.values()).filter(c => c.status === 'PENDING').length,
      activeProposals: Array.from(this.proposals.values()).filter(p => p.status === 'ACTIVE').length
    };
  }
}

export default ClaimRoot;
