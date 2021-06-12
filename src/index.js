export default function enummapping(data) {
    const buidInKeys = ['$list', '$map'];
    const keyRes = {};
    const codeRes = {};
    for (const [k, v] of Object.entries(data)) {
        if (buidInKeys.includes(k)) {
            throw new Error(`"${k}"为内置属性，不能作为枚举值的key！`);
        }
        if (codeRes[`${v.code}`]) {
            throw new Error(`"${k}"的code值"${v.code}"已被使用！`);
        }
        const item = {
            ...v,
            eq: code => code === v.code,
            is: key => key === k,
            in: keys => keys.includes(k),
        };
        keyRes[k] = item;
        codeRes[`${v.code}`] = item;
    }
    const res = {
        ...keyRes,
        ...codeRes,
        $list(excludes = []) {
            return Object.values(keyRes)
                .filter(item => !item.in(Array.isArray(excludes) ? excludes : [excludes]) && !item.$exclude)
                .sort((a, b) => (a.$sort ?? 0) - (b.$sort ?? 0));
        },
        $map(fn, excludes) {
            return this.$list(excludes).map(fn);
        },
        $options(excludes = []) {
            return this.$map(item => ({ label: item.label || `${item.code}`, value: item.code }), excludes);
        },
    };
    return res;
}
