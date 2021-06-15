type DataItemBuildIn = {
  /** 用于获取列表的排序 */
  $sort?: number;
  /** `$list` `$map` `$options` 是否默认排除 */
  $exclude?: boolean;
};

type DataItem<C, O> = {
  code: C;
  label?: string;
} & DataItemBuildIn & O;

type EnumItemBuild<K, C> = {
  is (key?: K): boolean;
  in (keys: K[]): boolean;
  eq (code?: C): boolean;
};

type EnumItem<K, C, O> = EnumItemBuild<K, C> & DataItem<C, O>;

type EnumBuildIn<K extends string, C, O> = {
  $list (this: Enum<K, C, O>, excludes?: K | K[]): EnumItem<K, C, O>[];
  $map <R>(this: Enum<K, C, O>, fn: (item: EnumItem<K, C, O>) => R, excludes?: K | K[]): R[];
  $options (excludes?: K | K[]): { value: C; label: string }[];
};

type EnumKeyRes<K extends string, C, O> = Record<K, EnumItem<K, C, O>>;

type EnumCodeRes<K, C, O> = {[key: string]: undefined | EnumItem<K, C, O>};

type Enum<K extends string, C, O> = EnumBuildIn<K, C, O> & EnumKeyRes<K, C, O> & EnumCodeRes<K, C, O>;

export type GetEnumCodeType<T> = T extends Enum<any, infer C, any> ? C : never;

export default function enummapping <K extends string, C = number, O = {}> (data: Record<K, DataItem<C, O>>): Enum<K, C, O> {
  const buidInKeys: string[] = ['$list', '$map', '$options'];
  const keyRes: EnumKeyRes<K, C, O> = {} as unknown as EnumKeyRes<K, C, O>;
  const codeRes: EnumCodeRes<K, C, O> = {} as unknown as EnumCodeRes<K, C, O>;

  for (const [k, v] of Object.entries<DataItem<C, O>>(data)) {
    if (buidInKeys.includes(k)) {
      throw new Error(`"${k}"为内置属性，不能作为枚举值的key！`);
    }
    if (codeRes[`${v.code}`]) {
      throw new Error(`"${k}"的code值"${v.code}"已被使用！`);
    }
    const item: EnumItem<K, C, O> = {
      ...v,
      eq: code => code === v.code,
      is: key => key === k,
      in: keys => keys.includes(k as unknown as K),
    };
    keyRes[k as unknown as K] = item;
    codeRes[`${v.code}`] = item;
  }

  const res: Enum<K, C, O> = {
    ...keyRes,
    ...codeRes,
    $list (excludes = []) {
      return Object.values<EnumItem<K, C, O>>(keyRes)
        .filter(item => !item.in(Array.isArray(excludes) ? excludes : [excludes]) && !item.$exclude)
        .sort((a, b) => (a.$sort ?? 0) - (b.$sort ?? 0));
    },
    $map (fn, excludes) {
      return this.$list(excludes).map(fn);
    },
    $options (excludes = []) {
      return this.$map(item => ({ label: item.label || `${item.code}`, value: item.code }), excludes);
    },
  };

  return res;
}
