const assign: typeof Object.assign = function assign () {
  const to = {};
  for (let index = 0; index < arguments.length; index++) {
    const nextSource = arguments[index];
    if (nextSource !== null && nextSource !== void 0) {
      for (const nextKey in nextSource) {
        if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
          to[nextKey] = nextSource[nextKey];
        }
      }
    }
  }
  return to;
};

function isArray (obj: any) {
  return Object.prototype.toString.call(obj) === '[object Array]';
}

type EnumData<C, O> = {
  code: C;
  label?: string;
  /** 用于获取列表的排序 */
  $sort?: number;
  /** `$list` `$map` `$options` 是否默认排除 */
  $exclude?: boolean;
} & O;

type EnumItemBuild<K, C> = {
  /** @deprecated since version 2.0 */
  is (key?: K): boolean;
  $is (key?: K): boolean;
  /** @deprecated since version 2.0 */
  in (keys: K[]): boolean;
  $in (keys: K[]): boolean;
  /** @deprecated since version 2.0 */
  eq (code?: C): boolean;
  $eq (code?: C): boolean;
};

type EnumItem<K, C, O> = EnumItemBuild<K, C> & EnumData<C, O>;

type EnumBuildIn<K extends string, C, O> = {
  $list (this: Enum<K, C, O>, excludes?: K | K[]): EnumItem<K, C, O>[];
  $map <R>(this: Enum<K, C, O>, fn: (item: EnumItem<K, C, O>) => R, excludes?: K | K[]): R[];
  $options (this: Enum<K, C, O>, excludes?: K | K[]): { value: C; label: string }[];
};

type EnumKeyRes<K extends string, C, O> = Record<K, EnumItem<K, C, O>>;

type EnumCodeRes<K, C, O> = {[key: string]: undefined | EnumItem<K, C, O>};

type Enum<K extends string, C, O> = EnumBuildIn<K, C, O> & EnumKeyRes<K, C, O> & EnumCodeRes<K, C, O>;

export type GetEnumCodeType<T> = T extends Enum<any, infer C, any> ? C : never;

const buidInEnumKeys: (keyof EnumBuildIn<any, any, any>)[] = ['$list', '$map', '$options'];
const buildInBuildItemKeys: (keyof EnumItemBuild<any, any>)[] = ['is', 'eq', 'in', '$is', '$eq', '$in'];

export default function enummapping <K extends string, C = number, O = {}> (data: Record<K, EnumData<C, O>>): Enum<K, C, O> {
  const keyRes: EnumKeyRes<K, C, O> = {} as unknown as EnumKeyRes<K, C, O>;
  const codeRes: EnumCodeRes<K, C, O> = {} as unknown as EnumCodeRes<K, C, O>;

  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const value = data[key];

      if (buidInEnumKeys.indexOf(key as any) > -1) {
        throw new Error(`The built-in property "${key}" cannot be used!`);
      }

      if (!value || !('code' in value)) {
        throw new Error(`Code must be specified!`);
      }

      for (let i = 0; i < buildInBuildItemKeys.length; i++) {
        if (buildInBuildItemKeys[i] in value) {
          throw new Error(`The built-in property "${buildInBuildItemKeys[i]}" cannot be used!`);
        }
      }

      if (codeRes[`${value.code}`]) {
        throw new Error(`The code "${value.code}" has been used!`);
      }

      const itemBuildIn: EnumItemBuild<K, C> = {
        eq: c => c === value.code,
        is: k => k === key,
        in: ks => ks.indexOf(key) > -1,
        $eq: c => c === value.code,
        $is: k => k === key,
        $in: ks => ks.indexOf(key) > -1,
      };

      const item: EnumItem<K, C, O> = assign(value, itemBuildIn);

      keyRes[key] = item;
      codeRes[`${value.code}`] = item;
    }
  }

  const enumBuildIn: EnumBuildIn<K, C, O> = {
    $list (excludes = []) {
      const res: EnumItem<K, C, O>[] = [];
      const excludesArr = (isArray(excludes) ? excludes : [excludes]) as K[];

      for (const key in keyRes) {
        if (Object.prototype.hasOwnProperty.call(keyRes, key)) {
          const value = keyRes[key];
          if (!value.$exclude && !value.$in(excludesArr)) {
            res.push(value);
          }
        }
      }

      return res.sort((a, b) => (a.$sort || 0) - (b.$sort || 0));
    },
    $map (fn, excludes = []) {
      if (typeof fn !== 'function') {
        throw new Error('is not a function!');
      }
      const res: ReturnType<typeof fn>[] = [];
      const list = this.$list(excludes);

      for (let i = 0; i < list.length; i++) {
        res.push(fn(list[i]));
      }

      return res;
    },
    $options (excludes = []) {
      return this.$map(item => ({ label: item.label || `${item.code}`, value: item.code }), excludes);
    },
  };

  return assign(keyRes, codeRes, enumBuildIn);
}
