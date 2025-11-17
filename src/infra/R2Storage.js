/**
 * R2 Storage - Infrastructure Layer
 * Cloudflare R2 compatible storage system
 */

export class R2Storage {
  constructor() {
    this.buckets = new Map();
    this.objects = new Map();
    this.stats = {
      totalStorage: 0,
      totalObjects: 0,
      totalRequests: 0
    };
  }

  createBucket(bucketName, config = {}) {
    if (this.buckets.has(bucketName)) {
      throw new Error(`Bucket ${bucketName} already exists`);
    }

    const bucket = {
      name: bucketName,
      createdAt: Date.now(),
      region: config.region || 'auto',
      versioning: config.versioning || false,
      objects: []
    };

    this.buckets.set(bucketName, bucket);
    return bucket;
  }

  putObject(bucketName, key, data, metadata = {}) {
    const bucket = this.buckets.get(bucketName);
    if (!bucket) {
      throw new Error(`Bucket ${bucketName} not found`);
    }

    const objectId = `${bucketName}/${key}`;
    const objectSize = JSON.stringify(data).length;

    const object = {
      key,
      bucket: bucketName,
      data,
      metadata,
      size: objectSize,
      createdAt: Date.now(),
      etag: this.generateETag(data)
    };

    this.objects.set(objectId, object);
    bucket.objects.push(key);
    
    this.stats.totalStorage += objectSize;
    this.stats.totalObjects++;
    this.stats.totalRequests++;

    return object;
  }

  getObject(bucketName, key) {
    const objectId = `${bucketName}/${key}`;
    const object = this.objects.get(objectId);
    
    if (!object) {
      throw new Error(`Object ${key} not found in bucket ${bucketName}`);
    }

    this.stats.totalRequests++;
    return object;
  }

  deleteObject(bucketName, key) {
    const objectId = `${bucketName}/${key}`;
    const object = this.objects.get(objectId);
    
    if (object) {
      this.stats.totalStorage -= object.size;
      this.stats.totalObjects--;
      this.objects.delete(objectId);
      
      const bucket = this.buckets.get(bucketName);
      bucket.objects = bucket.objects.filter(k => k !== key);
      
      return true;
    }
    return false;
  }

  listObjects(bucketName, prefix = '') {
    const bucket = this.buckets.get(bucketName);
    if (!bucket) {
      throw new Error(`Bucket ${bucketName} not found`);
    }

    return bucket.objects
      .filter(key => key.startsWith(prefix))
      .map(key => this.objects.get(`${bucketName}/${key}`));
  }

  generateETag(data) {
    const str = JSON.stringify(data);
    return str.split('').reduce(
      (hash, char) => ((hash << 5) - hash) + char.charCodeAt(0), 0
    ).toString(16);
  }

  getStorageStats() {
    return {
      ...this.stats,
      buckets: this.buckets.size,
      avgObjectSize: this.stats.totalObjects > 0 
        ? Math.round(this.stats.totalStorage / this.stats.totalObjects)
        : 0
    };
  }
}

export default R2Storage;
