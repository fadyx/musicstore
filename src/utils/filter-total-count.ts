export const filterTotalCount = (o: any) => {
	const { totalCount, ...rest } = o;
	return rest;
};
