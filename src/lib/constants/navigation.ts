import type { NavigationItem } from '@/lib/types/navigation';

const NAV_ITEMS: NavigationItem[] = [
  {
    label: '챗봇 응답 지식 관리',
    id: 'knowledge',
    description:
      'Manages knowledge base and related data for chatbot responses to user questions',
    children: [
      {
        label: '지식 청크 관리',
        id: 'chunks',
        description:
          'Systematically manages knowledge units used in chatbot responses',
        children: [
          {
            label: 'Commercial',
            id: 'commercial',
            description:
              'Manages knowledge and information related to commercial operations',
            children: [
              {
                label: 'Basic Slot Allocation(BSA)',
                id: 'bsa',
                description:
                  'Manages knowledge and rules related to basic slot allocation',
              },
              {
                label: 'Vessel Space Control(VSC)',
                id: 'vsc',
                description:
                  'Manages knowledge related to vessel space control and management',
              },
              {
                label: 'Freight Rate Contract(FRC)',
                id: 'frc',
                description:
                  'Manages freight rate contract information and knowledge',
              },
              {
                label: 'Agent Commission(ACM)',
                id: 'acm',
                description:
                  'Manages knowledge related to agent commission and delegation',
              },
              {
                label: 'Container Business Performance(CBP)',
                id: 'cbp',
                description:
                  'Manages container business performance analysis and knowledge',
              },
            ],
          },
          {
            label: 'Customer Service',
            id: 'customer-service',
            description: 'Manages customer service related knowledge and FAQs',
          },
          {
            label: 'Logistics',
            id: 'logistics',
            description:
              'Manages logistics and transportation related knowledge and information',
          },
          {
            label: 'Equipment',
            id: 'equipment',
            description:
              'Manages equipment and facility related knowledge and manuals',
          },
          {
            label: 'Vessel',
            id: 'vessel',
            description:
              'Manages technical knowledge and operational information related to vessels',
          },
          {
            label: 'Finance',
            id: 'finance',
            description:
              'Manages financial and accounting related knowledge and policies',
          },
        ],
      },
      {
        label: '인텐트 관리',
        id: 'intent-management',
        description: 'Manages intent data for understanding user intentions',
      },
      {
        label: 'API 관리',
        id: 'api-management',
        description:
          'Manages external API integration and data collection related knowledge',
      },
    ],
  },
  {
    label: '답변 관리',
    id: 'response-management',
    description: 'Configures and manages chatbot response settings',
    children: [
      {
        label: '답변 도출 과정',
        id: 'response-extraction-process',
        description: 'Manages chatbot response extraction process',
        children: [
          {
            label: 'AI Chatbot Test',
            id: 'ai-chatbot-test',
            description: 'Views and manages all registered AI Chatbot Test',
          },
        ],
      },
      {
        label: '시나리오 관리',
        id: 'scenario-management',
        description:
          'Manages scenarios that define conversation flows with the chatbot',
        children: [
          {
            label: '시나리오 기본 관리',
            id: 'scenario-basic',
            description: 'Manages basic scenario operations',
            children: [
              {
                label: '시나리오 목록',
                id: 'scenario-list',
                description: 'Views and manages all registered scenarios',
              },
              {
                label: '시나리오 생성',
                id: 'scenario-create',
                description: 'Creates new conversation scenarios',
              },
              {
                label: '시나리오 수정',
                id: 'scenario-edit',
                description: 'Modifies and updates existing scenarios',
              },
            ],
          },
          {
            label: '시나리오 고급 기능',
            id: 'scenario-advanced',
            description: 'Manages advanced scenario features',
            children: [
              {
                label: '시나리오 템플릿',
                id: 'scenario-template',
                description: 'Manages scenario templates for reuse',
              },
              {
                label: '시나리오 버전 관리',
                id: 'scenario-version',
                description: 'Manages different versions of scenarios',
              },
              {
                label: '시나리오 테스트',
                id: 'scenario-test',
                description: 'Tests and validates scenario flows',
              },
            ],
          },
        ],
      },
      {
        label: '답변 템플릿 관리',
        id: 'response-template-management',
        description: 'Manages standard templates used in chatbot responses',
        children: [
          {
            label: '템플릿 기본 관리',
            id: 'template-basic',
            description: 'Manages basic template operations',
            children: [
              {
                label: '템플릿 목록',
                id: 'template-list',
                description: 'Views all registered response templates',
              },
              {
                label: '템플릿 생성',
                id: 'template-create',
                description: 'Creates new response templates',
              },
            ],
          },
          {
            label: '템플릿 고급 기능',
            id: 'template-advanced',
            description: 'Manages advanced template features',
            children: [
              {
                label: '템플릿 카테고리',
                id: 'template-category',
                description: 'Organizes templates by categories',
              },
              {
                label: '템플릿 변수 관리',
                id: 'template-variables',
                description: 'Manages dynamic variables in templates',
              },
            ],
          },
        ],
      },
      {
        label: '사용자 피드백',
        id: 'user-feedback',
        description: 'Collects and analyzes feedback from users',
        children: [
          {
            label: '피드백 수집 관리',
            id: 'feedback-collection',
            description: 'Manages feedback collection process',
            children: [
              {
                label: '피드백 목록',
                id: 'feedback-list',
                description: 'Views and manages user feedback list',
              },
              {
                label: '피드백 수집 설정',
                id: 'feedback-settings',
                description: 'Configures feedback collection methods',
              },
            ],
          },
          {
            label: '피드백 분석 관리',
            id: 'feedback-analysis',
            description: 'Manages feedback analysis and reporting',
            children: [
              {
                label: '피드백 통계',
                id: 'feedback-statistics',
                description: 'Provides statistics by analyzing feedback data',
              },
              {
                label: '피드백 트렌드',
                id: 'feedback-trends',
                description: 'Analyzes feedback trends over time',
              },
            ],
          },
        ],
      },
      {
        label: '통계 및 리포트',
        id: 'statistics-report',
        description:
          'Analyzes chatbot usage status and performance to generate reports',
        children: [
          {
            label: '사용 통계 관리',
            id: 'usage-statistics',
            description: 'Manages chatbot usage statistics',
            children: [
              {
                label: '챗봇 사용 통계',
                id: 'chatbot-usage-statistics',
                description:
                  'Provides chatbot usage and performance statistics',
              },
              {
                label: '사용자 행동 분석',
                id: 'user-behavior-analysis',
                description: 'Analyzes user interaction patterns',
              },
            ],
          },
          {
            label: '지식 활용 관리',
            id: 'knowledge-utilization',
            description: 'Manages knowledge utilization analysis',
            children: [
              {
                label: '지식 활용 리포트',
                id: 'knowledge-report',
                description:
                  'Analyzes knowledge base utilization and effectiveness',
              },
              {
                label: '지식 품질 평가',
                id: 'knowledge-quality',
                description: 'Evaluates quality and relevance of knowledge',
              },
            ],
          },
        ],
      },
      {
        label: '시스템 로그',
        id: 'system-log',
        description: 'Views and manages operation logs of the chatbot system',
        children: [
          {
            label: '로그 조회 관리',
            id: 'log-view-management',
            description: 'Manages log viewing and analysis',
            children: [
              {
                label: '로그 조회',
                id: 'log-view',
                description: 'Views and analyzes system logs',
              },
              {
                label: '로그 필터링',
                id: 'log-filtering',
                description: 'Filters logs by various criteria',
              },
            ],
          },
          {
            label: '로그 데이터 관리',
            id: 'log-data-management',
            description: 'Manages log data operations',
            children: [
              {
                label: '로그 다운로드',
                id: 'log-download',
                description: 'Downloads log data as files',
              },
              {
                label: '로그 백업',
                id: 'log-backup',
                description: 'Backs up log data for preservation',
              },
            ],
          },
        ],
      },
      {
        label: '권한 및 접근 제어',
        id: 'permission-access-control',
        description: 'Manages system access permissions and user roles',
        children: [
          {
            label: '사용자 계정 관리',
            id: 'user-account-management',
            description: 'Manages user account operations',
            children: [
              {
                label: '사용자 관리',
                id: 'user-management',
                description: 'Manages system user accounts',
              },
              {
                label: '계정 상태 관리',
                id: 'account-status',
                description: 'Manages user account status and activation',
              },
            ],
          },
          {
            label: '권한 및 역할 관리',
            id: 'permission-role-management',
            description: 'Manages permissions and role assignments',
            children: [
              {
                label: '역할 관리',
                id: 'role-management',
                description: 'Sets user roles and permissions',
              },
              {
                label: '권한 그룹 관리',
                id: 'permission-groups',
                description: 'Manages permission groups and assignments',
              },
            ],
          },
          {
            label: '접근 모니터링',
            id: 'access-monitoring',
            description: 'Monitors and tracks user access',
            children: [
              {
                label: '접근 이력',
                id: 'access-history',
                description: 'Tracks user access records',
              },
              {
                label: '접근 패턴 분석',
                id: 'access-pattern-analysis',
                description: 'Analyzes user access patterns',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    label: '환경설정',
    id: 'settings',
    description: 'Configures system basic settings and user environment',
    children: [
      {
        label: '일반 설정',
        id: 'general-settings',
        description: 'Manages basic system settings',
        children: [
          {
            label: '시스템 기본 정보',
            id: 'system-basic-info',
            description: 'Manages basic system information',
            children: [
              {
                label: '시스템 정보',
                id: 'system-info',
                description: 'Checks system version and basic information',
              },
              {
                label: '시스템 상태',
                id: 'system-status',
                description: 'Monitors overall system health',
              },
            ],
          },
          {
            label: '사용자 인터페이스',
            id: 'user-interface',
            description: 'Manages user interface settings',
            children: [
              {
                label: '테마 설정',
                id: 'theme-settings',
                description: 'Sets user interface theme',
              },
              {
                label: '레이아웃 설정',
                id: 'layout-settings',
                description: 'Configures interface layout preferences',
              },
            ],
          },
          {
            label: '국제화 설정',
            id: 'internationalization',
            description: 'Manages localization and language settings',
            children: [
              {
                label: '언어 설정',
                id: 'language-settings',
                description:
                  'Manages system language and localization settings',
              },
              {
                label: '시간대 설정',
                id: 'timezone-settings',
                description: 'Configures system timezone settings',
              },
            ],
          },
        ],
      },
      {
        label: '알림 설정',
        id: 'notification-settings',
        description: 'Configures system notification and alert methods',
        children: [
          {
            label: '이메일 알림 관리',
            id: 'email-notification-management',
            description: 'Manages email notification operations',
            children: [
              {
                label: '이메일 알림',
                id: 'email-notification',
                description: 'Manages email notification settings',
              },
              {
                label: '이메일 템플릿',
                id: 'email-templates',
                description: 'Manages email notification templates',
              },
            ],
          },
          {
            label: '푸시 알림 관리',
            id: 'push-notification-management',
            description: 'Manages push notification operations',
            children: [
              {
                label: '푸시 알림',
                id: 'push-notification',
                description: 'Configures push notification settings',
              },
              {
                label: '푸시 토큰 관리',
                id: 'push-token-management',
                description: 'Manages push notification tokens',
              },
            ],
          },
          {
            label: '알림 이력 관리',
            id: 'notification-history-management',
            description: 'Manages notification history and records',
            children: [
              {
                label: '알림 기록',
                id: 'notification-history',
                description: 'Checks history of sent notifications',
              },
              {
                label: '알림 통계',
                id: 'notification-statistics',
                description: 'Provides notification delivery statistics',
              },
            ],
          },
        ],
      },
      {
        label: '보안 설정',
        id: 'security-settings',
        description:
          'Manages account security and authentication related settings',
        children: [
          {
            label: '인증 보안',
            id: 'authentication-security',
            description: 'Manages authentication security settings',
            children: [
              {
                label: '비밀번호 변경',
                id: 'change-password',
                description: 'Changes user password',
              },
              {
                label: '비밀번호 정책',
                id: 'password-policy',
                description: 'Configures password security policies',
              },
            ],
          },
          {
            label: '2단계 인증 관리',
            id: 'two-factor-management',
            description: 'Manages two-factor authentication',
            children: [
              {
                label: '2단계 인증',
                id: 'two-factor-auth',
                description: 'Manages two-factor authentication settings',
              },
              {
                label: '백업 코드 관리',
                id: 'backup-codes',
                description: 'Manages backup authentication codes',
              },
            ],
          },
          {
            label: '접속 보안 관리',
            id: 'login-security-management',
            description: 'Manages login security and monitoring',
            children: [
              {
                label: '접속 기록',
                id: 'login-history',
                description: 'Checks account login history',
              },
              {
                label: '접속 제한 설정',
                id: 'login-restrictions',
                description: 'Configures login attempt restrictions',
              },
            ],
          },
        ],
      },
      {
        label: '백업 및 복원',
        id: 'backup-restore',
        description: 'Manages backup and restoration of system data',
        children: [
          {
            label: '데이터 백업 관리',
            id: 'data-backup-management',
            description: 'Manages data backup operations',
            children: [
              {
                label: '데이터 백업',
                id: 'data-backup',
                description: 'Backs up important data',
              },
              {
                label: '백업 스케줄링',
                id: 'backup-scheduling',
                description: 'Schedules automatic backup operations',
              },
            ],
          },
          {
            label: '데이터 복원 관리',
            id: 'data-restore-management',
            description: 'Manages data restoration operations',
            children: [
              {
                label: '데이터 복원',
                id: 'data-restore',
                description: 'Restores backed up data',
              },
              {
                label: '복원 테스트',
                id: 'restore-testing',
                description: 'Tests data restoration procedures',
              },
            ],
          },
          {
            label: '백업 이력 관리',
            id: 'backup-history-management',
            description: 'Manages backup history and monitoring',
            children: [
              {
                label: '백업 이력',
                id: 'backup-history',
                description: 'Checks backup job history',
              },
              {
                label: '백업 상태 모니터링',
                id: 'backup-status-monitoring',
                description: 'Monitors backup job status and health',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    label: '고객 지원',
    id: 'customer-support',
    description: 'Manages customer inquiries and support services',
    children: [
      {
        label: '문의 관리',
        id: 'inquiry-management',
        description: 'Systematically manages customer inquiries',
        children: [
          {
            label: '문의 수신 관리',
            id: 'inquiry-reception',
            description: 'Manages incoming inquiry operations',
            children: [
              {
                label: '문의 목록',
                id: 'inquiry-list',
                description: 'Views received customer inquiries',
              },
              {
                label: '문의 분류',
                id: 'inquiry-classification',
                description: 'Classifies and categorizes inquiries',
              },
            ],
          },
          {
            label: '문의 응답 관리',
            id: 'inquiry-response-management',
            description: 'Manages inquiry response operations',
            children: [
              {
                label: '문의 답변',
                id: 'inquiry-response',
                description: 'Writes responses to customer inquiries',
              },
              {
                label: '답변 템플릿',
                id: 'inquiry-response-templates',
                description: 'Manages response templates for inquiries',
              },
            ],
          },
          {
            label: '문의 추적 관리',
            id: 'inquiry-tracking',
            description: 'Manages inquiry tracking and follow-up',
            children: [
              {
                label: '문의 상태 추적',
                id: 'inquiry-status-tracking',
                description: 'Tracks inquiry resolution status',
              },
              {
                label: '문의 이력 관리',
                id: 'inquiry-history',
                description: 'Manages complete inquiry history',
              },
            ],
          },
        ],
      },
      {
        label: 'FAQ 관리',
        id: 'faq-management',
        description: 'Manages frequently asked questions and answers',
        children: [
          {
            label: 'FAQ 기본 관리',
            id: 'faq-basic-management',
            description: 'Manages basic FAQ operations',
            children: [
              {
                label: 'FAQ 목록',
                id: 'faq-list',
                description: 'Views and manages registered FAQs',
              },
              {
                label: 'FAQ 등록',
                id: 'faq-create',
                description: 'Registers new FAQs',
              },
            ],
          },
          {
            label: 'FAQ 고급 관리',
            id: 'faq-advanced-management',
            description: 'Manages advanced FAQ features',
            children: [
              {
                label: 'FAQ 카테고리',
                id: 'faq-categories',
                description: 'Organizes FAQs by categories',
              },
              {
                label: 'FAQ 검색 최적화',
                id: 'faq-search-optimization',
                description: 'Optimizes FAQ search functionality',
              },
            ],
          },
          {
            label: 'FAQ 품질 관리',
            id: 'faq-quality-management',
            description: 'Manages FAQ quality and effectiveness',
            children: [
              {
                label: 'FAQ 품질 평가',
                id: 'faq-quality-assessment',
                description: 'Evaluates FAQ quality and relevance',
              },
              {
                label: 'FAQ 사용 통계',
                id: 'faq-usage-statistics',
                description: 'Tracks FAQ usage and effectiveness',
              },
            ],
          },
        ],
      },
      {
        label: '공지사항',
        id: 'notice',
        description: 'Manages system announcements and update information',
        children: [
          {
            label: '공지사항 기본 관리',
            id: 'notice-basic-management',
            description: 'Manages basic notice operations',
            children: [
              {
                label: '공지사항 목록',
                id: 'notice-list',
                description: 'Views registered announcements',
              },
              {
                label: '공지사항 작성',
                id: 'notice-create',
                description: 'Writes new announcements',
              },
            ],
          },
          {
            label: '공지사항 고급 관리',
            id: 'notice-advanced-management',
            description: 'Manages advanced notice features',
            children: [
              {
                label: '공지사항 카테고리',
                id: 'notice-categories',
                description: 'Organizes notices by categories',
              },
              {
                label: '공지사항 템플릿',
                id: 'notice-templates',
                description: 'Manages notice templates for consistency',
              },
            ],
          },
          {
            label: '공지사항 배포 관리',
            id: 'notice-distribution-management',
            description: 'Manages notice distribution and targeting',
            children: [
              {
                label: '공지사항 배포',
                id: 'notice-distribution',
                description: 'Manages notice distribution to users',
              },
              {
                label: '공지사항 수신 확인',
                id: 'notice-receipt-confirmation',
                description: 'Tracks notice receipt and read status',
              },
            ],
          },
        ],
      },
    ],
  },
];

export default NAV_ITEMS;
