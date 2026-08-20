![QuickLook icon](https://user-images.githubusercontent.com/1687847/29485863-8cd61b7c-84e2-11e7-97d5-eacc2ba10d28.png)

# QuickLook HWP Viewer Plugin — polka306 fork

[![CI](https://github.com/polka306/QuickLook.Plugin.HwpViewer/actions/workflows/ci.yml/badge.svg)](https://github.com/polka306/QuickLook.Plugin.HwpViewer/actions/workflows/ci.yml)

> **이 저장소는 [syehoonkim/QuickLook.Plugin.HwpViewer](https://github.com/syehoonkim/QuickLook.Plugin.HwpViewer)의 포크입니다.**
> 플러그인의 설계와 구현은 원저자 **Syehoon Kim** 님의 작업이고, 이 포크는 그 위에
> 저희 환경에 필요한 것을 얹은 것입니다.
> 원본을 쓰고 싶으시면 위 링크로 가시면 됩니다.

Windows용 [**QuickLook**](https://github.com/QL-Win/QuickLook)에서 한글 **HWP / HWPX 파일을 미리보기** 할 수 있게 해주는 플러그인입니다.
파일 탐색기에서 문서를 선택한 뒤 **Space 키**를 누르면 내용을 즉시 확인할 수 있습니다.

문서 파싱과 렌더링은 [**rhwp**](https://github.com/edwardkim/rhwp)가 담당하고, 브라우저 엔진(WebView2) 위에서 그려집니다.

---

## 🔀 이 포크가 원본과 다른 점

2026-08-20 기준입니다.

| | 원본 (릴리스 0.2.13) | 이 포크 (릴리스 0.2.14) |
| --- | --- | --- |
| HWP 미리보기 | ✅ | ✅ |
| HWPX 미리보기 | `main`에 코드는 있으나 릴리스 자산에는 아직 미포함 | ✅ 릴리스에 포함 |
| 릴리스 조건 | rhwp가 갱신될 때 | rhwp 갱신 **또는** 플러그인 소스 변경 시 |
| 자동 테스트 | — | `tests/` (릴리스 태그 전에 실행) |

**HWPX 지원 코드 자체는 원본 저장소의 커밋 [`44f5395`](https://github.com/syehoonkim/QuickLook.Plugin.HwpViewer/commit/44f53959053fd0ddf6a8a459282f0759fd6732c4) "support .hwpx"이며 원저자의 작업입니다.**
원본의 릴리스 워크플로는 rhwp 업데이트를 감지했을 때 새 버전을 만드는 구조라, 소스만 바뀐 이 커밋에는 아직 릴리스 태그가 붙지 않은 상태입니다. 저희는 HWPX 미리보기가 당장 필요해서 이 커밋을 빌드해 배포했고, 소스 변경만으로도 릴리스가 나가도록 워크플로를 조정했습니다.

> ⚠️ 두 플러그인은 설치 폴더 이름(`QuickLook.Plugin.HwpViewer`)이 같아서 **동시에 설치할 수 없습니다.** 이 포크를 설치하면 원본을 덮어씁니다.

---

## 📥 설치

1. [Releases](https://github.com/polka306/QuickLook.Plugin.HwpViewer/releases/latest)에서 `QuickLook.Plugin.HwpViewer.qlplugin`을 받습니다.
2. QuickLook이 실행 중인 상태에서 받은 파일을 선택하고 **Space**를 누릅니다.
3. **Install**을 누른 뒤 **QuickLook을 재시작**합니다.

기존 버전을 미리 지울 필요는 없습니다. 설치 관리자가 기존 파일을 정리한 뒤 새로 풀고, 재시작할 때 잔여 파일을 삭제합니다. 다만 **재시작하지 않으면 구버전이 계속 메모리에 남아 있어** 변경이 적용되지 않습니다.

---

## ✨ 주요 기능

- 📄 HWP / HWPX 파일 미리보기
- 🖥️ WebView2 기반 렌더링 (Canvas2D, 실패 시 SVG 폴백)
- 🔎 화면에 들어온 페이지만 렌더링하는 지연 로딩
- ⚡ 서버 없이 로컬에서 동작

## 📦 지원 환경

- Windows 10 / 11
- QuickLook (by Paddy Xu)
- Microsoft Edge WebView2 Runtime

---

## 🛠️ 개발

플러그인 본체는 Windows에서 빌드합니다.

```powershell
nuget restore QuickLook.Plugin.HwpViewer.sln
./Scripts/update-version.ps1
msbuild QuickLook.Plugin.HwpViewer.sln /p:Configuration=Release /p:Platform="Any CPU"
cd Scripts; ./pack-zip.ps1     # QuickLook.Plugin.HwpViewer.qlplugin 생성
```

포맷 지원 테스트는 Node.js 22 이상이면 어느 OS에서나 돌아갑니다.

```bash
node --test tests/*.test.mjs
```

이 테스트는 rhwp가 `.hwp`/`.hwpx`를 실제로 열고 렌더링하는지, 그리고 `Plugin.cs`의 `CanHandle`이 엔진이 지원하는 확장자를 모두 통과시키는지를 확인합니다. fixture는 사용자 문서 대신 rhwp의 내장 빈 문서 템플릿에서 생성합니다 (`node tests/generate-fixtures.mjs`).

---

## 🔁 원본 저장소와의 관계

- 원본의 변경사항은 계속 가져올 계획입니다.
  ```bash
  git remote add upstream https://github.com/syehoonkim/QuickLook.Plugin.HwpViewer.git
  git fetch upstream
  ```
- 이 포크에서 만든 개선 중 원본에 도움이 될 만한 것은 PR로 제안하려고 합니다.
- **플러그인 자체에 대한 버그·기능 요청은 원본 저장소로 올려주시는 편이 좋습니다.** 이 저장소의 이슈는 위 표에 적힌 포크 고유 변경사항에 한정됩니다.

---

## 📜 라이선스

본 프로젝트는 **MIT License**에 따라 배포됩니다. 저작권은 원본 프로젝트를 따릅니다 — Copyright © 2020 Paddy Xu, Copyright © 2025 Syehoon Kim. [`LICENSE.txt`](LICENSE.txt)를 참고하세요.

또한 다음의 제3자 오픈소스 소프트웨어를 사용합니다.

- **rhwp** — Copyright © **Edward Kim**, MIT License — <https://github.com/edwardkim/rhwp>
- **hwp.js** — Copyright © **Han Lee** and contributors, Apache License 2.0 — <https://github.com/hahnlee/hwp.js>
  (원본 플러그인이 `v0.0.6`까지 사용했습니다. 자세한 내용은 [`NOTICE`](NOTICE) 참고)

## 🙏 감사의 말

- 이 플러그인을 만들고 공개해주신 **Syehoon Kim** 님께 감사드립니다. 이 포크는 그 작업이 없었다면 존재할 수 없습니다.
- HWP 파싱·렌더링 엔진을 만들어주신 **rhwp**의 **Edward Kim** 님께 감사드립니다.
- **hwp.js** 개발자 및 기여자 분들께 감사드립니다.
- **QuickLook** 프로젝트를 유지·개발해주신 **Paddy Xu** 님께 감사드립니다.

---
---

# QuickLook HWP Viewer Plugin — polka306 fork

> **This repository is a fork of [syehoonkim/QuickLook.Plugin.HwpViewer](https://github.com/syehoonkim/QuickLook.Plugin.HwpViewer).**
> The plugin's design and implementation are the work of its original author, **Syehoon Kim**.
> This fork only adds what we needed on top of it. If you want the original, follow the link above.

A **QuickLook plugin for Windows** that enables **previewing HWP and HWPX (Hangul Word Processor) files**.
Select a document in File Explorer and press **Space** to preview it instantly.

Parsing and rendering are handled by [**rhwp**](https://github.com/edwardkim/rhwp), drawn inside a WebView2 (Chromium) environment.

---

## 🔀 How this fork differs

As of 2026-08-20.

| | Upstream (release 0.2.13) | This fork (release 0.2.14) |
| --- | --- | --- |
| HWP preview | ✅ | ✅ |
| HWPX preview | in `main`, not yet in a release asset | ✅ shipped in the release |
| Release trigger | when rhwp updates | when rhwp updates **or** plugin sources change |
| Automated tests | — | `tests/`, run before tagging a release |

**The HWPX support itself is upstream commit [`44f5395`](https://github.com/syehoonkim/QuickLook.Plugin.HwpViewer/commit/44f53959053fd0ddf6a8a459282f0759fd6732c4) "support .hwpx" — the original author's work.**
Upstream's release workflow cuts a version when it detects an rhwp update, so this source-only commit has not been tagged yet. We needed HWPX previews right away, so we built and published that commit, and adjusted the workflow so source-only changes can be released too.

> ⚠️ Both plugins install into the same folder (`QuickLook.Plugin.HwpViewer`), so they **cannot be installed side by side.** Installing this fork replaces the original.

---

## 📥 Installation

1. Download `QuickLook.Plugin.HwpViewer.qlplugin` from [Releases](https://github.com/polka306/QuickLook.Plugin.HwpViewer/releases/latest).
2. With QuickLook running, select the file and press **Space**.
3. Click **Install**, then **restart QuickLook**.

There is no need to remove a previous version first — the installer clears the existing files, extracts the new ones, and deletes the leftovers on the next start. **The restart is required**, otherwise the old build stays loaded in memory.

---

## ✨ Features

- 📄 Preview HWP and HWPX files
- 🖥️ WebView2-based rendering (Canvas2D, with an SVG fallback)
- 🔎 Lazy rendering — only pages that scroll into view are drawn
- ⚡ Works locally without any server

## 📦 Requirements

- Windows 10 / 11
- QuickLook (by Paddy Xu)
- Microsoft Edge WebView2 Runtime

---

## 🛠️ Development

The plugin itself builds on Windows:

```powershell
nuget restore QuickLook.Plugin.HwpViewer.sln
./Scripts/update-version.ps1
msbuild QuickLook.Plugin.HwpViewer.sln /p:Configuration=Release /p:Platform="Any CPU"
cd Scripts; ./pack-zip.ps1     # produces QuickLook.Plugin.HwpViewer.qlplugin
```

The format-support tests run on any OS with Node.js 22+:

```bash
node --test tests/*.test.mjs
```

They verify that rhwp actually opens and renders `.hwp`/`.hwpx`, and that `CanHandle` in `Plugin.cs` accepts every extension the engine supports. Fixtures are generated from rhwp's built-in blank document template rather than real documents (`node tests/generate-fixtures.mjs`).

---

## 🔁 Relationship with upstream

- We intend to keep pulling upstream changes:
  ```bash
  git remote add upstream https://github.com/syehoonkim/QuickLook.Plugin.HwpViewer.git
  git fetch upstream
  ```
- Improvements made here that would help upstream will be offered as pull requests.
- **Please report bugs and feature requests about the plugin itself to the upstream repository.** Issues here are limited to the fork-specific changes listed above.

---

## 📜 License

Licensed under the **MIT License**. Copyright follows the upstream project — Copyright © 2020 Paddy Xu, Copyright © 2025 Syehoon Kim. See [`LICENSE.txt`](LICENSE.txt).

This project also makes use of the following third-party software:

- **rhwp** — Copyright © **Edward Kim**, MIT License — <https://github.com/edwardkim/rhwp>
- **hwp.js** — Copyright © **Han Lee** and contributors, Apache License 2.0 — <https://github.com/hahnlee/hwp.js>
  (used by the original plugin up to `v0.0.6`; see [`NOTICE`](NOTICE))

## 🙏 Acknowledgements

- Thanks to **Syehoon Kim** for building and open-sourcing this plugin. This fork would not exist without that work.
- Thanks to **Edward Kim** for **rhwp**, the HWP parsing and rendering engine.
- Thanks to the contributors of **hwp.js**.
- Thanks to **Paddy Xu** for maintaining the **QuickLook** project.
