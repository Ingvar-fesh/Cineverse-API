import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class RedisCacheService {
    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

    async get<T>(key: string) {
        const data = await this.cacheManager.get<T>(key);
        if (data) {
            console.log(`Cache hit: ${key}`);
        } else {
            console.log(`Cache mis: ${key}`);
        }
        return data;
    }

    async set(key: string, data: any, ttl: number = 300000) {
        const safeData = instanceToPlain(data);
        await this.cacheManager.set(key, safeData, ttl);
        console.log(`Cache set: ${key}`);
    }

    async del(key: string): Promise<void> {
        await this.cacheManager.del(key);
        console.log(`Cache delete: ${key}`);
    }

    async reset(): Promise<void> {
        const client = this.cacheManager as any;
        if (client.stores) {
            await Promise.all(client.stores.map((store: any) => store.reset()));
        } 
        else if (client.store && typeof client.store.reset === 'function') {
            await client.store.reset();
        }
        
        console.log('Cache cleared (reset)');
    }
}
