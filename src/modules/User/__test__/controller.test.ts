import request from 'supertest';
import app from '../../../app';

it('Post request should return status code 200 and id', async () => {
    const result = await request(app)
        .post('/auth/login')
        .send({ email: 'testmail@gmail.com', password: 1234 })
        .expect(200);

    const { id } = JSON.parse(result.text);
    expect(id).toBe(1);
});
