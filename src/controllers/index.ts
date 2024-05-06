import { Router } from 'express';
import scrapeRouter from './scrape';
import contentRouter from './contents';
import memoRouter from './memo';

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
    {
        path: '/content',
        router: contentRouter,
    },
    {
        path: '/memo',
        router: memoRouter,
    },
];

routes.forEach((route) => {
    apiRouter.use(route.path, route.router);
});

export default apiRouter;
