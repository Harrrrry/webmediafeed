import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('Comments (e2e)', () => {
  let app: INestApplication<App>;
  let token: string;
  let postId: string;
  let commentId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();

    // Register and login user
    const user = { username: 'commentuser', email: 'commentuser@example.com', password: 'TestPass123' };
    await request(app.getHttpServer()).post('/users/register').send(user);
    const loginRes = await request(app.getHttpServer()).post('/users/login').send({ username: user.username, password: user.password });
    token = loginRes.body.access_token;
    // Create a post
    const postDto = { mediaUrl: 'http://example.com/comment.jpg', mediaType: 'image', caption: 'Comment post' };
    const postRes = await request(app.getHttpServer())
      .post('/posts')
      .set('Authorization', `Bearer ${token}`)
      .send(postDto);
    postId = postRes.body._id || postRes.body.id;
  });

  it('should add a comment', async () => {
    const res = await request(app.getHttpServer())
      .post(`/comments/post/${postId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ text: 'Nice post!' })
      .expect(201);
    expect(res.body).toHaveProperty('text', 'Nice post!');
    expect(res.body).toHaveProperty('postId', postId);
    commentId = res.body._id || res.body.id;
  });

  it('should fetch comments for the post', async () => {
    const res = await request(app.getHttpServer())
      .get(`/comments/post/${postId}`)
      .expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.some((c: any) => c.text === 'Nice post!')).toBe(true);
  });

  it('should delete the comment', async () => {
    await request(app.getHttpServer())
      .delete(`/comments/${commentId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    const res = await request(app.getHttpServer())
      .get(`/comments/post/${postId}`)
      .expect(200);
    expect(res.body.some((c: any) => c._id === commentId || c.id === commentId)).toBe(false);
  });
}); 