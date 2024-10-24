export enum FilterCondition {
	Any = 'any',
	All = 'all',
	None = 'none',
}

type CriterionCallback = (item: any, args: any) => boolean;
/*
export enum CriterionType {
	String = 'string',
	Number = 'number',
	Function = 'function',
}*/

export enum CriterionNumberOperator {
	Equal = '=',
	NotEqual = '!=',
	LessThan = '<',
	LessEqual = '<=',
	GreaterThan = '>',
	GreaterEqual = '<=',
	StartsWith = 'starts_with',
	EndsWith = 'ends_with',
}

export enum CriterionStringOperator {
	Equal = '=',
	NotEqual = '!=',
	StartsWith = 'starts_with',
	EndsWith = 'ends_with',
	Includes = 'includes',
}

export const CriterionFilterOperator = 'filter';
export const CriterionFunctionOperator = 'function';

type CriterionOperator = CriterionNumberOperator | CriterionStringOperator | typeof CriterionFilterOperator | typeof CriterionFunctionOperator;

type CriterionValue = string | number | Filter | CriterionCallback;

type CriterionParams = {
	//type?: CriterionType,
	operator?: CriterionOperator,
	property?: string,
	value?: CriterionValue,
	trim?: boolean,
	matchCase?: boolean,
	invert?: boolean,
};

type FilterParams = {
	condition?: FilterCondition,
	subFilters?: Array<FilterParams> | Set<FilterParams>,
	criteria?: Array<CriterionParams> | Set<CriterionParams>,
};

export class Criterion {
	//type: CriterionType;
	operator: CriterionOperator;
	property?: string;
	value: CriterionValue;
	trim: boolean;
	matchCase: boolean;
	invert: boolean;

	constructor(params: CriterionParams = {}) {
		//this.type = params.type ?? CriterionType.String;
		this.operator = params.operator ?? CriterionStringOperator.Equal;
		this.property = params.property;
		this.value = params.value ?? '';
		this.trim = params.trim ?? true;
		this.matchCase = params.matchCase ?? false;
		this.invert = params.invert ?? false;
	}

	matchFilter(item: any, args?: any): boolean {
		const match = this.#matchFilter(item, args);

		if (this.invert) {
			return !match;
		} else {
			return match;
		}
	}

	#matchFilter(item: any, args?: any): boolean {
		switch (this.operator) {
			case CriterionStringOperator.Equal:
				break;
			case CriterionFilterOperator:
				return (this.value as Filter).matchFilter(item, args);
			case CriterionFunctionOperator:
				return (this.value as CriterionCallback)(item, args);
		}
		return false;
	}
}

export class Filter {
	#criteria = new Set<Criterion>();
	//#subFilters = new Set<Filter>();
	condition: FilterCondition;

	constructor(params: FilterParams = {}) {
		this.condition = params.condition ?? FilterCondition.All;

		if (params.criteria) {
			for (const crit of params.criteria) {
				this.#criteria.add(new Criterion(crit));
			}
		}
		/*
				if (params.subFilters) {
					for (const df of params.subFilters) {
						this.#subFilters.add(new Filter(df));
					}
				}
		*/
	}

	matchFilter(item: any, args?: any): boolean {
		for (const criterion of this.#criteria) {
			const criterionResult = criterion.matchFilter(item, args);
			if ((criterionResult && this.condition == FilterCondition.None) ||
				(!criterionResult && this.condition == FilterCondition.All)) {
				return false;
			}
		}
		return true;
	}
}
