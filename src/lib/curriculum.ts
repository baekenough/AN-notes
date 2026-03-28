import type { TipMeta } from './content';

interface CurriculumLocaleConfig {
  heading: string;
  hereMarker: string;
  descriptions: Record<string, string>;
}

const curriculumConfig: Record<string, Record<string, CurriculumLocaleConfig>> = {
  'gpt-codex': {
    en: {
      heading: 'Curriculum path',
      hereMarker: 'You are here',
      descriptions: {
        'codex-getting-started': 'first safe loops',
        'codex-instructions': 'repo rules and defaults',
        'codex-sandbox': 'permissions and boundaries',
        'codex-task-design': 'shape work well',
        'codex-skills': 'turn repeated work into reusable assets',
        'codex-subagents': 'parallel execution and delegation',
        'codex-mcp': 'connect outside systems',
        'codex-ci-cd-workflows': 'run stable workflows repeatedly',
      },
    },
    ko: {
      heading: '커리큘럼 흐름',
      hereMarker: '현재 문서',
      descriptions: {
        'codex-getting-started': '입문 루프',
        'codex-instructions': '저장소 규칙',
        'codex-sandbox': '권한과 승인',
        'codex-task-design': '좋은 task shape 만들기',
        'codex-skills': '반복 워크플로우를 재사용 자산으로 만들기',
        'codex-subagents': '병렬 실행과 위임',
        'codex-mcp': '외부 시스템 연결',
        'codex-ci-cd-workflows': '반복 작업 운영',
      },
    },
    es: {
      heading: 'Ruta del currículo',
      hereMarker: 'Estás aquí',
      descriptions: {
        'codex-getting-started': 'primeros loops seguros',
        'codex-instructions': 'reglas del repo y defaults',
        'codex-sandbox': 'permisos y límites',
        'codex-task-design': 'dar buena forma al trabajo',
        'codex-skills': 'convertir trabajo repetido en activos reutilizables',
        'codex-subagents': 'ejecución paralela y delegación',
        'codex-mcp': 'conectar sistemas externos',
        'codex-ci-cd-workflows': 'ejecutar workflows estables una y otra vez',
      },
    },
  },
  'gemini-cli': {
    en: {
      heading: 'Learning path',
      hereMarker: 'You are here',
      descriptions: {
        'getting-started': 'install, auth, memory basics',
        'million-token-context': 'repo-scale analysis without waste',
        'gemini-extensions': 'package commands, MCP, and skills',
        'trusted-folders-sandboxing': 'trust, isolation, and rollback',
        'headless-automation': 'scripts, CI, and structured output',
        'sub-agents-and-skills': 'delegation and specialist workflows',
      },
    },
    ko: {
      heading: '학습 경로',
      hereMarker: '현재 문서',
      descriptions: {
        'getting-started': '설치, 인증, 메모리 기초',
        'million-token-context': '저장소 단위 분석을 낭비 없이',
        'gemini-extensions': '명령, MCP, 스킬 패키징',
        'trusted-folders-sandboxing': '신뢰, 격리, 복구',
        'headless-automation': '스크립트, CI, 구조화 출력',
        'sub-agents-and-skills': '위임과 전문가 워크플로',
      },
    },
    es: {
      heading: 'Ruta de aprendizaje',
      hereMarker: 'Estás aquí',
      descriptions: {
        'getting-started': 'instalación, autenticación y memoria',
        'million-token-context': 'análisis de repos sin derroche',
        'gemini-extensions': 'empaquetar comandos, MCP y skills',
        'trusted-folders-sandboxing': 'confianza, aislamiento y rollback',
        'headless-automation': 'scripts, CI y salida estructurada',
        'sub-agents-and-skills': 'delegación y flujos especialistas',
      },
    },
  },
};

export function generateCurriculumNav(
  tips: TipMeta[],
  locale: string,
  tool: string,
  currentSlug: string,
): string {
  const config = curriculumConfig[tool]?.[locale] || curriculumConfig[tool]?.['en'];
  if (!config || tips.length === 0) return '';

  const lines = tips.map((tip, i) => {
    const desc = config.descriptions[tip.slug] || '';
    const descSuffix = desc ? ` — ${desc}` : '';
    if (tip.slug === currentSlug) {
      return `${i + 1}. **${tip.title}**${descSuffix} ← **${config.hereMarker}**`;
    }
    return `${i + 1}. [${tip.title}](./${tip.slug})${descSuffix}`;
  });

  return `## ${config.heading}\n\n${lines.join('\n')}`;
}

export { curriculumConfig };
