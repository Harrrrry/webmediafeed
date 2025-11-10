import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { disconnect } from 'mongoose';

describe('ShaadiController (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let creatorUserId: string;
  let testShaadiId: string;
  let memberUserId: string;
  let memberToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
    await app.init();

    // Create test users and get auth tokens
    const creatorData = {
      username: 'testcreator',
      email: 'creator@test.com',
      password: 'password123'
    };

    const memberData = {
      username: 'testmember',
      email: 'member@test.com',
      password: 'password123'
    };

    // Register creator
    const creatorRes = await request(app.getHttpServer())
      .post('/users/register')
      .send(creatorData);
    
    creatorUserId = creatorRes.body.user.id;
    authToken = creatorRes.body.access_token;

    // Register member
    const memberRes = await request(app.getHttpServer())
      .post('/users/register')
      .send(memberData);
    
    memberUserId = memberRes.body.user.id;
    memberToken = memberRes.body.access_token;
  });

  afterAll(async () => {
    await app.close();
    await disconnect();
  });

  describe('Shaadi Creation', () => {
    it('should create a shaadi with valid data', async () => {
      const shaadiData = {
        name: 'Test Wedding',
        brideName: 'Asha',
        groomName: 'Ravi',
        date: '2024-12-01',
        location: 'Delhi',
      };

      const res = await request(app.getHttpServer())
        .post('/shaadi')
        .set('Authorization', `Bearer ${authToken}`)
        .send(shaadiData)
        .expect(201);

      expect(res.body).toHaveProperty('_id');
      expect(res.body.name).toBe(shaadiData.name);
      expect(res.body.brideName).toBe(shaadiData.brideName);
      expect(res.body.groomName).toBe(shaadiData.groomName);
      expect(res.body.createdBy).toBe(creatorUserId);
      expect(res.body.isDeleted).toBe(false);

      testShaadiId = res.body._id;
    });

    it('should fail with 400 if required fields are missing', async () => {
      const res = await request(app.getHttpServer())
        .post('/shaadi')
        .set('Authorization', `Bearer ${authToken}`)
        .send({})
        .expect(400);

      expect(res.body.message).toBe('Missing required fields');
    });
  });

  describe('Shaadi Deletion', () => {
    it('should delete shaadi when called by creator', async () => {
      const deleteData = {
        reason: 'Test deletion'
      };

      const res = await request(app.getHttpServer())
        .delete(`/shaadi/${testShaadiId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(deleteData)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Shaadi deleted successfully');
    });

    it('should fail when non-creator tries to delete shaadi', async () => {
      // Create another shaadi for this test
      const shaadiData = {
        name: 'Another Wedding',
        brideName: 'Priya',
        groomName: 'Amit',
        date: '2024-12-15',
        location: 'Mumbai',
      };

      const createRes = await request(app.getHttpServer())
        .post('/shaadi')
        .set('Authorization', `Bearer ${authToken}`)
        .send(shaadiData);

      const newShaadiId = createRes.body._id;

      // Try to delete with member token (should fail)
      const res = await request(app.getHttpServer())
        .delete(`/shaadi/${newShaadiId}`)
        .set('Authorization', `Bearer ${memberToken}`)
        .send({ reason: 'Unauthorized deletion attempt' })
        .expect(400);

      expect(res.body.message).toBe('Only the creator can delete the Shaadi');
    });

    it('should fail when trying to delete non-existent shaadi', async () => {
      const fakeShaadiId = '507f1f77bcf86cd799439999';
      
      const res = await request(app.getHttpServer())
        .delete(`/shaadi/${fakeShaadiId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ reason: 'Test' })
        .expect(400);

      expect(res.body.message).toBe('Shaadi not found or already deleted');
    });

    it('should fail when trying to delete already deleted shaadi', async () => {
      // Try to delete the same shaadi again (already deleted in first test)
      const res = await request(app.getHttpServer())
        .delete(`/shaadi/${testShaadiId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ reason: 'Second deletion attempt' })
        .expect(400);

      expect(res.body.message).toBe('Shaadi not found or already deleted');
    });

    it('should fail without authentication', async () => {
      const shaadiData = {
        name: 'Unauth Test Wedding',
        brideName: 'Test',
        groomName: 'User',
        date: '2024-12-20',
        location: 'Test City',
      };

      const createRes = await request(app.getHttpServer())
        .post('/shaadi')
        .set('Authorization', `Bearer ${authToken}`)
        .send(shaadiData);

      const shaadiId = createRes.body._id;

      // Try to delete without auth token
      await request(app.getHttpServer())
        .delete(`/shaadi/${shaadiId}`)
        .send({ reason: 'No auth test' })
        .expect(401);
    });
  });

  describe('Shaadi Listing After Deletion', () => {
    it('should not include deleted shaadis in user shaadis list', async () => {
      const res = await request(app.getHttpServer())
        .get('/shaadi/user')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Check that deleted shaadi is not in the list
      const shaadiIds = res.body.map((membership: any) => membership.shaadi._id);
      expect(shaadiIds).not.toContain(testShaadiId);
    });
  });
}); 