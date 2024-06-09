export const preference = {
    '웹 개발': 0,
    '모바일 앱 개발': 1,
    'UI/UX디자인': 2,
    '서버 개발': 3,
    'DB 관리': 4,
    아키텍쳐: 5,
    보안: 6,
    '운영 배포': 7,
    머신러닝: 8,
    데이터과학: 9,
    '생성형 AI': 10,
    '추천 시스템': 11,
    '프로젝트 계획': 12,
    '프로젝트 방법론': 13,
    '프로젝트 관리도구/기술': 14,
    '품질 관리': 15,
};

export type PreferenceKey = keyof typeof preference;

export const PreferenceKeyValues = Object.keys(preference);
