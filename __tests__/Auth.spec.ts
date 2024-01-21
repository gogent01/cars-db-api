import request, { type Response } from 'supertest';
import { App } from '../src/App';

const app = new App();

beforeAll(async () => {
  await app.launch();
});

describe('Tests for routes inaccessible without authorization', () => {
  it.only.each`
    route                    | method
    ${'/api/v1/cars'}        | ${'POST'}
    ${'/api/v1/cars'}        | ${'GET'}
    ${'/api/v1/cars/:carId'} | ${'PUT'}
    ${'/api/v1/cars/:carId'} | ${'DELETE'}
  `('$method $route returns 401 Forbidden when accessed without Bearer token', async ({ route, method }) => {
    const agent = request(app.api);
    const concreteRoute = route.replace(/:[A-Za-z0-9-_]+/g, '1');

    let response: Response;
    switch (method) {
      case 'POST':
        response = await agent.post(concreteRoute).send();
        break;
      case 'GET':
        response = await agent.get(concreteRoute).send();
        break;
      case 'PUT':
        response = await agent.put(concreteRoute).send();
        break;
      case 'PATCH':
        response = await agent.put(concreteRoute).send();
        break;
      case 'DELETE':
        response = await agent.delete(concreteRoute).send();
        break;
      default:
        response = await agent.get(concreteRoute).send();
        break;
    }

    expect(response.status).toBe(401);
  });
});
