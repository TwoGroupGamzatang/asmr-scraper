import { StatusCodes } from 'http-status-codes';

export class ErrorCode {
    // Common
    public static readonly invalidInputValue = new ErrorCode(
        'C01',
        'Invalid Input Value.',
        StatusCodes.BAD_REQUEST
    );
    public static readonly methodNotAllowed = new ErrorCode(
        'C02',
        'Invalid Method Type.',
        StatusCodes.METHOD_NOT_ALLOWED
    );
    public static readonly entityNotFound = new ErrorCode(
        'C03',
        'Entity Not Found.',
        StatusCodes.BAD_REQUEST
    );
    public static readonly methodArgumentNotValid = new ErrorCode(
        'C04',
        'Method Argument Not Valid.',
        StatusCodes.BAD_REQUEST
    );
    public static readonly notFound = new ErrorCode(
        'C05',
        'Not Found.',
        StatusCodes.NOT_FOUND
    );
    public static readonly internalServerError = new ErrorCode(
        'C06',
        'Internal Server Error.',
        StatusCodes.INTERNAL_SERVER_ERROR
    );

    // Auth
    public static readonly tokenNotFound = new ErrorCode(
        'A01',
        'Token Not Found.',
        StatusCodes.FORBIDDEN
    );
    public static readonly invalidToken = new ErrorCode(
        'A02',
        'Invalid Token.',
        StatusCodes.FORBIDDEN
    );

    // User
    public static readonly userAccessDenied = new ErrorCode(
        'U01',
        'User Access is Denied.',
        StatusCodes.UNAUTHORIZED
    );

    // Scrap
    public static readonly noScraperAvailable = new ErrorCode(
        'S01',
        'No Scraper Available.',
        StatusCodes.BAD_REQUEST
    );
    public static readonly scrapeFailed = new ErrorCode(
        'S02',
        'Scrape Failed.',
        StatusCodes.INTERNAL_SERVER_ERROR
    );
    public static readonly alreadyScraped = new ErrorCode(
        'S03',
        'Already Scraped.',
        StatusCodes.BAD_REQUEST
    );

    // Content
    public static readonly contentNotFound = new ErrorCode(
        'C01',
        'Content Not Found.',
        StatusCodes.NOT_FOUND
    );
    public static readonly onlyDeleteMyContent = new ErrorCode(
        'C02',
        "Cannot Delete Other User's Content.",
        StatusCodes.FORBIDDEN
    );

    // Memo
    public static readonly memoNotFound = new ErrorCode(
        'M01',
        'Memo Not Found.',
        StatusCodes.NOT_FOUND
    );

    // External API
    public static readonly summarizeFailed = new ErrorCode(
        'E01',
        'Summarize Failed.',
        StatusCodes.INTERNAL_SERVER_ERROR
    );

    constructor(
        public readonly code: string,
        public readonly message: string,
        public readonly status: number
    ) {}
}
