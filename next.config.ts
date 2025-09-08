import type { NextConfig } from "next";
// 로컬 최소 타입으로 처리하여 외부 타입 의존성 제거
type RuleSetRuleLike = {
  test?: RegExp;
  issuer?: unknown;
  resourceQuery?: unknown;
  exclude?: unknown;
  [key: string]: unknown;
};

const nextConfig: NextConfig = {
  /* config options here */
  webpack(config) {
    // 기존 SVG 처리 규칙 탐색 (없을 수 있으므로 안전하게 처리)
    const existingSvgRule = config.module.rules.find((rule: unknown) => {
      const r = rule as RuleSetRuleLike;
      return r?.test instanceof RegExp && r.test.test(".svg");
    }) as RuleSetRuleLike | undefined;

    // *.svg?url 은 기존 자산 로더를 사용(있으면 복제), 없으면 asset/resource 사용
    const svgUrlRule: RuleSetRuleLike = existingSvgRule
      ? {
          ...existingSvgRule,
          test: /\.svg$/i,
          resourceQuery: /url/,
        }
      : {
          test: /\.svg$/i,
          resourceQuery: /url/,
          type: "asset/resource",
        };

    // 그 외 *.svg 은 React 컴포넌트로 변환(@svgr/webpack)
    const svgrRule: RuleSetRuleLike = {
      test: /\.svg$/i,
      issuer: existingSvgRule?.issuer,
      resourceQuery: { not: [/url/] },
      use: [
        {
          loader: "@svgr/webpack",
          options: { svgo: true, titleProp: true, ref: true },
        },
      ],
    };

    config.module.rules.push(svgUrlRule, svgrRule);

    // 기존 규칙이 있었다면 svg 를 제외 처리하여 중복 매칭 방지
    if (existingSvgRule) {
      const excludeSvg = /\.svg$/i;
      if (Array.isArray(existingSvgRule.exclude)) {
        existingSvgRule.exclude = [...existingSvgRule.exclude, excludeSvg];
      } else if (existingSvgRule.exclude) {
        existingSvgRule.exclude = [existingSvgRule.exclude, excludeSvg];
      } else {
        existingSvgRule.exclude = excludeSvg;
      }
    }

    return config;
  },
};

export default nextConfig;
