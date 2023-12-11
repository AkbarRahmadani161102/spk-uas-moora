export default function pivot(data: any) {
    var iter = function (pivoted: any, record: any) {
        for (var key in record) {
            if (!pivoted[key]) pivoted[key] = [];
            pivoted[key].push(record[key]);
        }
        return pivoted;
    };
    return data.reduce(iter, []);
}