export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface MatchInfo {
	match: string;
	index: number;
	length: number;
	groups: string[];
	step: number;
}

export interface TextSegment {
	text: string;
	type: 'normal' | 'match';
	step?: number;
	isLatest?: boolean;
}

export interface LessonStep {
	id: string;
	title: string;
	explanation: string;
	pattern: string;
	testText: string;
	expectedMatches: number;
	tips: string[];
}

export interface Lesson {
	id: string;
	title: string;
	description: string;
	difficulty: Difficulty;
	steps: LessonStep[];
}