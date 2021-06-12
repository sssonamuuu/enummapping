# enummapping

由于 `typescript` 的枚举只有 `key` `code` 的两者关联，而实际使用远远不止，还有有 `label` 甚至更多字段的关联。

**以下方法、属性使用均有 `typescript` 签名以及编辑器提示。**

## 语法

``` javascript
import enummapping from 'enummapping';

const enumdata = enummapping({
  key1: enumOption,
  key2: enumOption,
  /** 更多枚举项 **/
});
```

## 参数

`enumOption`：为每个枚举项属性描述，包含以下属性

| 键 | 值类型 | 是否必填 | 默认值 | 说明 |
|:--|:--:|:--:|:--:|:--|
|`code`|`string` \| `number` |✔️|-|当前枚举项的 `code` 值
|`label`|`string`|❌|-|当前枚举项的文本值
|`$sort`|`number`|❌|0|`list` 以及 `map` 方法调用时的排序参数（按照当前值降序）
|`$exclude`|`boolean`|❌|false|`list` 以及 `map` 方法调用是否忽略该项
|`[any key]`|`any`|❌|-|可以添加其他任意键值对


``` javascript
import enummapping from 'enummapping';

const gender = enummapping({
  male: { code: 1, label: '男' },
  female: { code: 2, label: '女' },
});

/** 增加自定义字段 */
const status = enummapping({
  notStart: { code: 1, label: '未开始', tagColor: 'red', /** ...more */ },
  processing: { code: 2, label: '进行中', tagColor: 'blue', /** ...more */ },
  ended: { code: 3, label: '已结束', tagColor: 'yellow', /** ...more */ },
});
```

1. 可以通过 `key` 或者 `code` 获取到当前项。

``` javascript
gender.male === gender[1]; // true

gender.male.code; // 1

/** 由于 `code` 获取不具用强约束（通常来说是服务端返回字段，肯能存在前端未配置项），所以TS声明为 undefined | item，在严格模式下需要使用可选链 */
gender[1]?.label; // 男 
```

2. `enumdata.$list(exculds)`：获取通过 `$sort` 排序后的枚举列表，并排除每一项 `option.$exclude`以及参数`exculds`数组中所包含的所有项。

``` javascript
console.log(gender.$list(['male'])); // [{ code: 2, label: '女', ...more }]
```

3. `enumdata.$map(fn, exculds)`：先通过 `$list` 获取后进行遍历调用 `fn` 方法并传入当前值以及 `index`。相当于 `enumdata.$list(exculds).map(fn)`。

``` jsx
gender.$map((item, index) => <span key={item.code}>{item.label}</span>)
```

4. `enumdata.$options(exculds)`：通过 `$list` 获取到列表后重新生成 `value = item.key`，`label = item.label || item.code` 的数组，主要用于 `antd` 的 `Select` 组件。

``` jsx
<Select options={gender.$options()}></Select>
```

5. `enumitem.is(key)`：判断当前项是否是某个枚举 `key`。

``` javascript
gender[1]?.is('male'); // true
gender[1]?.is('female'); // false
```

6. `enumitem.eq(code)`：判断当前项是否是某个枚举 `code`。

``` javascript
gender.male.eq(1); // true
gender.male.eq(2); // false
```

7. `enumitem.in(keys)`：判断当前项是否在某一系列枚举 `keys` 中。

``` javascript
gender[1].in(['male', 'female']); // true
```