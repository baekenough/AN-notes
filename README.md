[한국어](README.md) | [English](README.en.md) | [Español](README.es.md)

---

# AI Native Notes

![Next.js](https://img.shields.io/badge/Next.js-16-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![License](https://img.shields.io/badge/License-MIT-green)

AI 코딩 도구를 제대로 쓰기 위한 커뮤니티 가이드 사이트

**라이브 사이트**: https://annotes.baekenough.com

![AI Native Notes Screenshot](docs/screenshot.png)

---

## AI Native Notes란?

AI Native Notes는 PyCon에서 영감을 받은 프로젝트입니다. PyCon이 Python 커뮤니티를 위한 공간이듯, AI Native Notes는 AI 코딩 도구를 실제로 잘 쓰고 싶은 모든 사람을 위한 실용적인 가이드 모음입니다.

Claude Code, GPT Codex, Gemini CLI — 각 도구의 실전 팁을 한곳에서 찾아보세요. 개발자뿐만 아니라 AI 도구를 업무에 활용하고 싶은 모든 분을 위해 만들었습니다.

---

## 지원 도구

| 도구 | 팁 수 | 상태 |
|------|-------|------|
| Claude Code (Anthropic) | 6 | 운영 중 |
| GPT Codex (OpenAI) | 10 | 운영 중 |
| Gemini CLI (Google) | 6 | 운영 중 |

---

## 주요 기능

- **22개 실전 팁** — 난이도, 읽기 시간, 관련 도구 연결 포함
- **3개 언어 지원** — 한국어, 영어, 스페인어 (중국어, 일본어 예정)
- **크로스툴 연결** — 각 팁에서 다른 도구의 관련 가이드로 바로 이동
- **What's New** — 도구별 최신 주요 기능 하이라이트
- **브라우저 언어 감지** — 자동 로케일 라우팅
- **다크 테마** — Geist 타이포그래피 적용
- **모바일 우선 반응형** — Z Flip 6부터 11인치 태블릿까지 지원

---

## 개발 시작하기

### 사전 요구사항

- Node.js 22 이상
- npm

### 설치 및 실행

```bash
git clone https://github.com/baekenough/AN-notes.git
cd AN-notes
npm install
npm run dev
```

브라우저에서 http://localhost:3000 을 열어 확인하세요.

### 콘텐츠 구조

```
content/
  {tool}/           # claude-code | gpt-codex | gemini-cli
    {slug}/
      ko.mdx        # 한국어
      en.mdx        # English
      es.mdx        # Español
```

---

## 콘텐츠 추가 방법

새 팁을 추가할 때는 각 언어별 MDX 파일을 생성하고 아래 프론트매터를 작성합니다.

```yaml
---
title: "팁 제목"
description: "한 줄 요약"
tool: claude-code          # claude-code | gpt-codex | gemini-cli
difficulty: beginner       # beginner | intermediate | advanced
readingTime: 5             # 분 단위
tags: [claude, workflow]
relatedTips:
  - tool: gpt-codex
    slug: agents-md
connections:
  - tool: gemini-cli
    slug: getting-started
    reason: "비슷한 설정 파일 접근 방식"
---
```

---

## 배포

Docker를 사용한 프로덕션 배포:

```bash
# 이미지 빌드
docker build -t ai-native-notes .

# 컨테이너 실행
docker run -p 3000:3000 ai-native-notes
```

HTTPS는 Cloudflare Tunnel을 통해 처리됩니다.

---

## 기여하기

새로운 팁, 번역 개선, 버그 수정 모두 환영합니다.

1. 이 저장소를 포크합니다
2. `feature/your-tip-name` 브랜치를 만듭니다
3. 변경사항을 커밋합니다 (`feat: add new tip for claude-code`)
4. Pull Request를 올립니다

팁 제안이나 피드백은 이슈로 남겨주세요.

---

## 라이선스

[MIT](LICENSE) — Copyright (c) 2026 baekenough

---

## 링크

- 라이브 사이트: https://annotes.baekenough.com
- GitHub: https://github.com/baekenough/AN-notes
