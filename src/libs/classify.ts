import axios from 'axios';
import { Logger } from './logger';
import {
    ClassificationFailedException,
    PersonalClassifierNotFoundException,
} from '../errors/exceptions/classification';
import { PreferenceKey } from '../controllers/scrape/types/preference';

type CreatePersonalClassifierResponse = {
    message: string;
};

type ClassifyWithClassifierResponse = {
    predicted_class: PreferenceKey;
    possible_classes: PreferenceKey[];
};

type UpdatePersonalPreferencesResponse = {
    message: string;
};

type UpdatePersonalClassifierResponse = {
    message: string;
};

const logger = new Logger(__filename);

export async function createPersonalClassifier(
    userId: string,
    preferences: PreferenceKey[]
): Promise<CreatePersonalClassifierResponse> {
    try {
        const response = await axios.post(
            'http://localhost:5000/create_personal_classifier',
            {
                userId,
                preferences,
            }
        );
        return response.data;
    } catch (err: any) {
        logger.error(err);
        throw new ClassificationFailedException();
    }
}

export async function classifyWithPersonalClassifier(
    userId: string,
    summarized_text: string
): Promise<ClassifyWithClassifierResponse> {
    try {
        const response = await axios.post(
            'http://localhost:5000/classify_with_personal_classifier',
            {
                userId,
                summarized_text,
            }
        );
        return response.data;
    } catch (err: any) {
        logger.error(err);
        throw new ClassificationFailedException();
    }
}

export async function classifyWithUniversalClassifier(
    summarized_text: string
): Promise<ClassifyWithClassifierResponse> {
    try {
        const response = await axios.post(
            'http://localhost:5000/classify_with_universal_classifier',
            {
                summarized_text,
            }
        );
        return response.data;
    } catch (err: any) {
        logger.error(err);
        throw new ClassificationFailedException();
    }
}

export async function updatePersonalPreferences(
    userId: string,
    preferences: PreferenceKey[]
): Promise<UpdatePersonalPreferencesResponse> {
    try {
        const response = await axios.post(
            'http://localhost:5000/update_personal_classifier',
            {
                userId,
                preferences,
            }
        );
        return response.data;
    } catch (err: any) {
        logger.error(err);
        throw new ClassificationFailedException();
    }
}

export async function updatePersonalClassifier(
    userId: string,
    summarized_text: string,
    user_update_label: string
): Promise<UpdatePersonalClassifierResponse> {
    try {
        const response = await axios.post(
            'http://localhost:5000/update_personal_classifier',
            {
                userId,
                summarized_text,
                user_update_label,
            }
        );
        return response.data;
    } catch (err: any) {
        logger.error(err);
        throw new ClassificationFailedException();
    }
}

export async function checkPersonalClassifier(
    userId: string
): Promise<{ isExist: boolean }> {
    try {
        const response = await axios.post(
            'http://localhost:5000/check_personal_classifier',
            {
                userId,
            }
        );
        return { isExist: JSON.parse(response.data.isExist.toLowerCase()) };
    } catch (err: any) {
        logger.error(err);
        throw new PersonalClassifierNotFoundException();
    }
}
