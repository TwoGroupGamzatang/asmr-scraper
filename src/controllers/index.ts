import { Router } from 'express';
import scrapeRouter from './scrape';

interface Route {
    path: string;
    router: Router;
}

const apiRouter = Router();

const routes: Route[] = [
    {
        path: '/scrape',
        router: scrapeRouter,
    },
];

routes.forEach((route) => {
    apiRouter.use(route.path, route.router);
});

export default apiRouter;
