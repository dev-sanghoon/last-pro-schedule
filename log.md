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
