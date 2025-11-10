import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  function uniqueUser(suffix: string) {
    return {
      username: `testuser_${suffix}`,
      email: `testuser_${suffix}@example.com`,
      password: 'TestPass123',
      phone: '1234567890',
      gender: 'male',
      profilePicUrl: 'http://example.com/profile.jpg',
    };
  }

  it('/users/register (POST) - full fields', async () => {
    const suffix = Math.random().toString(36).substring(2, 8);
    const mockUser = uniqueUser(suffix);
    const res = await request(app.getHttpServer())
      .post('/users/register')
      .send(mockUser)
      .expect(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('username', mockUser.username);
    expect(res.body).toHaveProperty('email', mockUser.email);
  });

  it('/users/register (POST) - missing required fields', async () => {
    const res = await request(app.getHttpServer())
      .post('/users/register')
      .send({ email: 'missing@example.com', password: 'TestPass123' })
      .expect(400);
    expect(res.body.message).toBeDefined();
  });

  it('/users/register (POST) - invalid gender', async () => {
    const res = await request(app.getHttpServer())
      .post('/users/register')
      .send({ username: 'badgender', email: 'badgender@example.com', password: 'TestPass123', gender: 'invalid' })
      .expect(400);
    expect(res.body.message).toContain('Gender must be male, female, or other');
  });

  it('/users/register (POST) - duplicate email/username', async () => {
    const suffix = Math.random().toString(36).substring(2, 8);
    const mockUser = uniqueUser(suffix);
    await request(app.getHttpServer()).post('/users/register').send(mockUser).expect(201);
    const res = await request(app.getHttpServer())
      .post('/users/register')
      .send(mockUser)
      .expect(409);
    expect(res.body.message).toContain('Username or email already exists');
  });

  it('/users/login (POST)', async () => {
    const loginDto = {
      username: 'testuser',
      password: 'TestPass123',
    };
    const res = await request(app.getHttpServer())
      .post('/users/login')
      .send(loginDto)
      .expect(201);
    expect(res.body).toHaveProperty('access_token');
  });

  it('/posts (POST)', async () => {
    // Register and login to get JWT
    const user = { username: 'postuser', email: 'postuser@example.com', password: 'TestPass123' };
    await request(app.getHttpServer()).post('/users/register').send(user);
    const loginRes = await request(app.getHttpServer()).post('/users/login').send({ username: user.username, password: user.password });
    const token = loginRes.body.access_token;
    expect(token).toBeDefined();

    // Create a post with multiple media and tags
    const postDto = {
      mediaUrls: [
        'http://example.com/image1.jpg',
        'http://example.com/image2.jpg',
        'http://example.com/video1.mp4'
      ],
      mediaTypes: ['image', 'image', 'video'],
      caption: 'Test post with multiple media',
      tags: ['haldi', 'shadi']
    };
    const res = await request(app.getHttpServer())
      .post('/posts')
      .set('Authorization', `Bearer ${token}`)
      .send(postDto)
      .expect(201);
    expect(res.body).toHaveProperty('mediaUrls');
    expect(Array.isArray(res.body.mediaUrls)).toBe(true);
    expect(res.body.mediaUrls.length).toBe(3);
    expect(res.body).toHaveProperty('mediaTypes');
    expect(Array.isArray(res.body.mediaTypes)).toBe(true);
    expect(res.body.mediaTypes).toEqual(['image', 'image', 'video']);
    expect(res.body).toHaveProperty('caption', postDto.caption);
    expect(res.body).toHaveProperty('tags');
    expect(res.body.tags).toEqual(['haldi', 'shadi']);
    expect(res.body).toHaveProperty('userId');
  });

  it('/posts (GET)', async () => {
    // Register and login to get JWT
    const user = { username: 'feeduser', email: 'feeduser@example.com', password: 'TestPass123' };
    await request(app.getHttpServer()).post('/users/register').send(user);
    const loginRes = await request(app.getHttpServer()).post('/users/login').send({ username: user.username, password: user.password });
    const token = loginRes.body.access_token;
    expect(token).toBeDefined();

    // Create a post with multiple media and tags
    const postDto = {
      mediaUrls: [
        'http://example.com/feed1.jpg',
        'http://example.com/feed2.jpg',
        'http://example.com/feedvideo.mp4'
      ],
      mediaTypes: ['image', 'image', 'video'],
      caption: 'Feed post with multiple media',
      tags: ['mehndi', 'reception']
    };
    const createRes = await request(app.getHttpServer())
      .post('/posts')
      .set('Authorization', `Bearer ${token}`)
      .send(postDto)
      .expect(201);
    expect(createRes.body).toHaveProperty('mediaUrls');
    expect(Array.isArray(createRes.body.mediaUrls)).toBe(true);
    expect(createRes.body.mediaUrls.length).toBe(3);
    expect(createRes.body).toHaveProperty('tags');
    expect(createRes.body.tags).toEqual(['mehndi', 'reception']);

    // Fetch the feed
    const feedRes = await request(app.getHttpServer())
      .get('/posts')
      .expect(200);
    expect(Array.isArray(feedRes.body)).toBe(true);
    expect(feedRes.body.some((p: any) => Array.isArray(p.mediaUrls) && p.mediaUrls.includes('http://example.com/feed1.jpg') && p.caption === postDto.caption)).toBe(true);
    expect(feedRes.body.some((p: any) => Array.isArray(p.tags) && p.tags.includes('mehndi'))).toBe(true);
  });
});
