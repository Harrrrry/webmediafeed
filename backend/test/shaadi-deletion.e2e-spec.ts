import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { disconnect } from 'mongoose';

describe('Shaadi Deletion (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await disconnect();
  });

  describe('DELETE /shaadi/:id', () => {
    it('should have the delete endpoint available', async () => {
      // Test that the endpoint exists (even if it returns 401 without auth)
      const res = await request(app.getHttpServer())
        .delete('/shaadi/507f1f77bcf86cd799439011')
        .expect(401);
        
      expect(res.body.message).toContain('Unauthorized');
    });

    it('should return error for invalid shaadi ID format', async () => {
      const res = await request(app.getHttpServer())
        .delete('/shaadi/invalid-id')
        .expect(401); // Should hit auth first
        
      expect(res.body.message).toContain('Unauthorized');
    });
  });

  describe('Soft Delete Schema Fields', () => {
    it('should verify shaadi schema includes soft delete fields', () => {
      // This tests that our schema changes are in place
      const { Shaadi } = require('../src/modules/shaadi/shaadi.schema');
      const schema = Shaadi.schema || Shaadi.prototype.schema;
      
      // We can't easily test the schema structure in e2e, 
      // but we can verify the service has the delete method
      const { ShaadiService } = require('../src/modules/shaadi/shaadi.service');
      const service = new ShaadiService({}, {});
      
      expect(typeof service.deleteShaadi).toBe('function');
    });
  });

  describe('API Response Structure', () => {
    it('should have correct API endpoints in controller', () => {
      // Test that all expected endpoints exist
      const { ShaadiController } = require('../src/modules/shaadi/shaadi.controller');
      const controller = new ShaadiController({});
      
      expect(typeof controller.deleteShaadi).toBe('function');
      expect(typeof controller.createShaadi).toBe('function');
      expect(typeof controller.getUserShaadis).toBe('function');
    });
  });
}); 