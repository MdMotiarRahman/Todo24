import { expect } from "chai";
import { initializeTestDb, insertTestUser, getToken } from './helpers/test.js';

const server = "http://localhost:3001"; // Adjust this path to your server file

describe('Task API', function () {
    
    // Test case for retrieving all tasks
    describe('GET /', function () {
        before(() => {
            initializeTestDb();
        });

        it('should return all tasks with status 200', async () => {
            const response = await fetch(server);
            const data = await response.json();

            expect(response.status).to.equal(200);
            expect(data).to.be.an('array').that.is.not.empty;
            expect(data[0]).to.include.all.keys('id', 'description');
        });
    });

    // Test suite for creating a new task
    describe('POST /create', function () {
        const email = 'post@foo.com'; 
        const password = 'post123'; 
        insertTestUser(email, password);
        const token = getToken(email);

        it('should create a new task', async () => {
            const newTask = { description: 'New Task' };
            const response = await fetch(server + '/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token
                },
                body: JSON.stringify(newTask)
            });
            const data = await response.json();

            expect(response.status).to.equal(200);
            expect(data).to.be.an('object');
            expect(data).to.include.all.keys('id');
        });

        it('should not create task without description', async () => {
            const newTask = { description: null };
            const response = await fetch(server + '/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newTask)
            });
            const data = await response.json();

            expect(response.status).to.equal(500);
            expect(data).to.be.an('object');
            expect(data).to.include.all.keys('error');
        });
    });

    // Test case for deleting task
    describe('DELETE /delete/:id', function () {
        it('should delete a task', async () => {
            const response = await fetch(server + '/delete/1', {
                method: 'DELETE'
            });
            const data = await response.json();

            expect(response.status).to.equal(200);
            expect(data).to.be.an('object');
            expect(data).to.include.all.keys('id');
        });

        it('should not delete a task with SQL injection', async () => {
            const response = await fetch(server + '/delete/id=0 or id > 0', {
                method: 'DELETE'
            });
            const data = await response.json();

            expect(response.status).to.equal(500);
            expect(data).to.be.an('object');
            expect(data).to.include.all.keys('error');
        });
    });

    // Test suite for user registration
    describe('POST /user/register', function () {
        const email = 'register@foo.com';
        const password = 'register123';

        it('should register with valid email and password', async () => {
            const response = await fetch(server + '/user/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();

            expect(response.status).to.equal(201, data.error);
            expect(data).to.be.an('object');
            expect(data).to.include.all.keys('id', 'email');
        });
    });

    // Test suite for user login
    describe('POST /user/login', function () {
        const email = 'login@foo.com';
        const password = 'login123';

        before(async () => {
            await insertTestUser(email, password); // Ensure the test user is inserted
        });

        it('should login with valid credentials', async () => {
            const response = await fetch(server + '/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            expect(response.status).to.equal(200, data.error);
            expect(data).to.be.an('object');
            expect(data).to.include.all.keys('id', 'email', 'token');
        });
    });
});
