# 개발일지

[2023-03-04](#2023-03-04)

## 2023-03-04

### tsc failure

```sh
index.ts(1,8): error TS1259: Module '"/Users/lostin185/Desktop/product/last-pro-schedule/node_modules/@types/express/index"' can only be default-imported using the 'esModuleInterop' flag
index.ts(2,8): error TS1192: Module '"/Users/lostin185/Desktop/product/last-pro-schedule/node_modules/dotenv/lib/main"' has no default export.
```

esModuleInterop 옵션은 convention으로 사용하는 옵션일까?

- nestjs의 기본 tsc 파일을 확인해봐야겠다.

[dotenv 예시 repo](https://github.com/dotenv-org/examples/tree/master/dotenv-typescript)에서는 정상적으로 동작하는데... 이것도 tsconfig 문제인가? 아마 path나 include 쪽 이슈일 듯하다.

tsconfig를 활용해서 간단하게 문제 해결이 가능하지만... 향후 변경한 옵션으로 문제 생길 가능성도 있다. 혼자 개발할 때 이런게 참 답답하다. 내 repo에서는 존재하는 convention이 없으니 하나하나 다 고민해서 결정해야한다. 그러니 정작 개발에 가서는 힘이 빠지는 경우가 더러 있다.

- 운영 환경도 아닌데, 미리 걱정할 필요가 있을까? 고민해서 해결될 문제라면 고민을 해야 하지만, convention에 대해 아는 바가 없는데 고민한다고 해서 해결될 문제도 아니니 그냥 진행하는게 맞다.

문제는 `npx tsc-watch index.ts`로 실행을 해서였다. `npx tsc-watch`로 실행했을 때엔 문제가 발생하지 않았다.

[두 커맨드의 차이는 문서에 정확히 나와있다](https://www.typescriptlang.org/docs/handbook/compiler-options.html). 물론 tsc-watch로 실행했지만, ts로 실행했을 경우에도 비슷한 에러를 확인할 수 있다.

### request의 type 검증은 어떻게 할 것인가?

```ts
type User = {
  email: string;
  password: string;
};
```

```json
{
  "email": "hello@world.com",
  "password": 18492
}
```

client에서 실수로 password를 숫자로 보내준다면 server에서 커버 가능해야 한다.

### 전체 route를 커버하는 response sender 생성 가능?

```js
res.status(400).send({
  success: false,
  message: err.message,
});
```

모든 route에서 굳이 status(400) 후 success: false가 포함된 객체를 보내는 코드를 작성할 필요는 없지 않은가.
