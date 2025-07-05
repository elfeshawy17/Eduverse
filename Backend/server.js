import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import { dbConnection } from './data/db.connection.js';
import HttpText from './utils/HttpText.js';
import { userRouter } from './src/modules/user/user.routes.js';
import { authRouter } from './src/modules/auth/auth.routes.js';
import courseRouter from './src/modules/courses/courses.routes.js';
import lectureRouter from './src/modules/lectures/lecture.routes.js';
import assignmentRouter from './src/modules/assignments/assignment.routes.js';
import { submissionRouter } from './src/modules/submission/submission.routes.js';
import { enrollmentRouter } from './src/modules/enrolments/enrollment.routes.js';
import swaggerUi from 'swagger-ui-express';
import swaggerFile from './swagger-output.json' with { type: 'json' };
import paymentConfigRouter from './src/modules/paymentConfig/paymentConfig.routes.js';
import paymentRouter from './src/modules/payment/payment.routes.js';


const app = express();
const port = process.env.SERVER_PORT;

app.use(cors());

app.use('/api/payment/webhook', express.raw({ type: 'application/json' }));

app.use(express.json());

app.use('/api/users', userRouter)
app.use('/api/auth', authRouter)
app.use('/api/courses', courseRouter)
app.use('/api/lectures', lectureRouter)
app.use('/api/assignments', assignmentRouter)
app.use('/api/submissions', submissionRouter)
app.use('/api/enrollments', enrollmentRouter)
app.use('/api/paymentConfig', paymentConfigRouter)
app.use('/api/payment', paymentRouter)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile, { swaggerOptions: { persistAuthorization: true } }));


app.all('*', (req, res, next) => {
    res.status(404).json({
        status: HttpText.ERROR,
        message: 'Route Is Not Found'
    })
});

app.use((error, req, res, next) => {
    res.status(error.statusCode || 500).json({
        status: error.statusText || HttpText.ERROR,
        message: error.message,
        data: null
    })
})


app.listen(port, () => console.log(`Server listening on port ${port}!`))