import { CriterionStringOperator, Filter, FilterCondition } from '../src/filter';

export const filter1 = new Filter({
	condition: FilterCondition.All,
	criteria: [
		{
			operator: CriterionStringOperator.Equal,
			property: 'name',
			value: 'item1',
		},
	],
});
