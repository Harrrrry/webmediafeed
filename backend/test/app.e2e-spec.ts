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

  it('/users/register (POST)', async () => {
    const mockUser = {
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'TestPass123',
    };
    const res = await request(app.getHttpServer())
      .post('/users/register')
      .send(mockUser)
      .expect(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('username', mockUser.username);
    expect(res.body).toHaveProperty('email', mockUser.email);
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

    // Create a post
    const postDto = { mediaUrl: 'http://example.com/image.jpg', mediaType: 'image', caption: 'Test post' };
    const res = await request(app.getHttpServer())
      .post('/posts')
      .set('Authorization', `Bearer ${token}`)
      .send(postDto)
      .expect(201);
    expect(res.body).toHaveProperty('mediaUrl', postDto.mediaUrl);
    expect(res.body).toHaveProperty('mediaType', postDto.mediaType);
    expect(res.body).toHaveProperty('caption', postDto.caption);
    expect(res.body).toHaveProperty('userId');
  });

  it('/posts (GET)', async () => {
    // Register and login to get JWT
    const user = { username: 'feeduser', email: 'feeduser@example.com', password: 'TestPass123' };
    await request(app.getHttpServer()).post('/users/register').send(user);
    const loginRes = await request(app.getHttpServer()).post('/users/login').send({ username: user.username, password: user.password });
    const token = loginRes.body.access_token;
    expect(token).toBeDefined();

    // Create a post
    const postDto = { mediaUrl: 'http://example.com/feed.jpg', mediaType: 'image', caption: 'Feed post' };
    const createRes = await request(app.getHttpServer())
      .post('/posts')
      .set('Authorization', `Bearer ${token}`)
      .send(postDto)
      .expect(201);
    expect(createRes.body).toHaveProperty('mediaUrl', postDto.mediaUrl);

    // Fetch the feed
    const feedRes = await request(app.getHttpServer())
      .get('/posts')
      .expect(200);
    expect(Array.isArray(feedRes.body)).toBe(true);
    expect(feedRes.body.some((p: any) => p.mediaUrl === postDto.mediaUrl && p.caption === postDto.caption)).toBe(true);
  });
});
