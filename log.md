# 개발일지

[2023-03-04](#2023-03-04)
[2023-03-05](#2023-03-05)
[2023-03-06](#2023-03-06)
[2023-03-07](#2023-03-07)
[2023-03-08](#2023-03-08)

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

방법이 있을 듯 한데, 우선순위가 아닌 것 같아서 향후로 미뤘다.

## 2023-03-05

### mysql node 패키지에서 createConnection과 pool 사이의 차이점은 무엇인지?

[Spring에서 설명(holax 님)](https://www.holaxprogramming.com/2013/01/10/devops-how-to-manage-dbcp/)에서 본 바, createConnection의 연산 비용이 커서 서버에서 db와 통신할 때 매번 커넥션을 실행하는 것이 아니라, 풀을 만들어놓고 그 풀을 계속해서 이용하는 듯 하다. Node.js에서는 어떤 방식으로 실행될 것인가?

트래픽 증가 시 이슈가 될 것 같다. 서버를 확장할 때 DB만 확장하는지? 서버도 함께 확장하는지? 음... 향후에 신경써야 할 부분 같고. 중요한 사항은 pool에 연결하여 사용 후, release connection을 활용해야 pool limit이 exceed되지 않을 듯 하다.

## 2023-03-06

### String LIKE vs '='

1. collation을 주의해야 함. '='의 경우 다른 string임에도 불구하고 collation으로 인해 같은 string으로 판단되는 경우가 있음.
2. 퍼포먼스의 경우 '='가 빠름.

### db pool 생성 전에 dotenv.config()를 실행하고 싶은데...

index.ts에서 db pool을 생성해서 export해주는 부분이 기형적으로 느껴져서, db pool 생성 코드를 다른 파일로 분리했다. 그리고 index.ts에서 import 해주었는데, import 이후 `dotenv.config()`가 실행되어 오류가 발생하였다. db pool 생성 코드에 env를 사용하기 때문에...
우선은 dotenv.config()를 해주고 import를 해주고 있으나, 여전히 기형적이라고 느낀다.

### typescript array destruction 시, empty array를 고려하지 않는 현상

[intended - use compiler tag if needed](https://stackoverflow.com/questions/62135076/ts-will-not-infer-possible-undefined-when-destructuring-empty-array)

### JWT issue

[Good explanation with some flaws](https://stackoverflow.com/questions/32060478/is-a-refresh-token-really-necessary-when-using-jwt-token-authentication)

## 2023-03-07

### private API 생성 방법

예를 들어, 회원정보 인증을 위한 이메일 전송 기능을 구현했다고 하자. 만약 누구나 이 기능을 사용할 수 있다면 특정 유저에게 우리 서버의 API를 활용해서 수십개의 메일을 보낼 수 있다. (별다른 이유 없이 악의적으로) CORS로 막을 수 있는 부분이 있을 듯 한데, REST Client를 활용하면 막을 수 없는 것 아닌가?

### mysql Timestamp

[Timestamp: Automatic Initialization & update](https://dev.mysql.com/doc/refman/8.0/en/timestamp-initialization.html)

`INSERT INTO PendUser (email, code) VALUES("aa@gm.com", "sdqqqwee") ON DUPLICATE KEY UPDATE email="aa@gm.com", code="sdqqqwee"`

## 2023-03-08

### Passing value with middleware on typescript
< 문제들 >
1. `req.currentUser = payload.email`을 시도했을 때에는 에러가 발생
Express에서 제공하는 Request 타입에는 currentUser가 존재하지 않기에 에러가 발생함.
2. `Object.assign(req, { currentUser: payload.email })`에서는 에러가 발생하지 않음.
그 자리에 발생하지 않는 것 뿐이지, currentUser을 사용하고픈 장소에서 해당 property를 호출하면 에러가 발생함. (Property '...' does not exist on type....)

< 해결책들 >
express-serve-static-core을 사용하는 방법과 커스텀 타입을 제공하는 방법이 있었다.

express-serve-static-core의 경우, 문제가 쉽사리 해결되는 경향이 있었지만 코드의 엔트로피가 증가하는 느낌을 받았다. 

따라서 커스텀 타입 파일을 제공하여 해결하였다.
찾아본 바로는 tsconfig.json의 typeRoots나 types에 type definition을 추가해주어야 한다고 보았는데, 별다른 옵션 추가 없이 src 밑에 @types 폴더를 만들자 자동으로 추가되었다.


