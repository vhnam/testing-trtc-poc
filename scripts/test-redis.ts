import { redis } from '../src/libs/redis';

async function testRedisConnection() {
  console.log('🔄 Testing Redis connection...');

  try {
    // Test basic connection
    const pong = await redis.ping();
    console.log('✅ Redis ping successful:', pong);

    // Test set/get with expiration
    const testKey = 'test:connection';
    const testValue = 'Hello Redis!';

    await redis.setex(testKey, 10, testValue); // 10 seconds expiration
    console.log('✅ Set test key with 10s expiration');

    const retrievedValue = await redis.get(testKey);
    console.log('✅ Retrieved value:', retrievedValue);

    // Test TTL (time to live)
    const ttl = await redis.ttl(testKey);
    console.log('✅ Key TTL (seconds):', ttl);

    // Clean up
    await redis.del(testKey);
    console.log('✅ Cleaned up test key');

    console.log('🎉 All Redis tests passed!');
  } catch (error) {
    console.error('❌ Redis test failed:', error);
  } finally {
    // Close connection
    await redis.disconnect();
    console.log('🔌 Disconnected from Redis');
    process.exit(0);
  }
}

// Run the test
testRedisConnection().catch(console.error);
