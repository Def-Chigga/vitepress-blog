import { defineConfig } from 'vitepress-theme-async/config'
import pkg from '../../package.json' with { type: 'json' }

const author = pkg.author.name
const base = '/vitepress-blog/'

/**
 * 获取实际年龄
 * @param year - 年
 * @param month - 月
 * @param day - 日
 */
function getAge(year: number, month: number, day: number) {
  const date = new Date()
  let age = date.getFullYear() - year
  const currentMonth = date.getMonth() + 1
  const currentDay = date.getDate()
  if (currentMonth < month) {
    return age - 1
  }
  if (currentMonth > month) {
    return age
  }
  if (currentDay < day) {
    return age - 1
  }
  return age
}

export default defineConfig({
  base, // 站点将部署到的 base URL
  srcDir: './',
  lang: 'zh',
  cleanUrls: true,
  /* 网站信息 */
  title: 'Blog',
  titleTemplate: `${author} 的小站`,
  description: `${author} 使用 Vitepress 搭建的博客站点`,
  rewrites: {
    'posts/(.*)': '(.*)',
  },
  /* 主题配置 */
  themeConfig: {
    // globalComponents: true, // 开启全局组件
    postDir: 'posts',
    rewritePost: true,
    // 自定义样式 - ['明亮模式', '暗黑模式']
    themeColor: {
      enable: true,
      primary: ['#6062ce', '#6062ce'],
      primaryWeak: ['#49649d', '#7a89df'],
      bodyColor: ['#1f2d3d', '#f1f1f1b3'],
      bodyBgColor: ['#00151f', '#00151f'],
      themeColor: ['#00283a', '#dedee0'],
      themeBgColor: ['#fcfcfe', '#00283a'],
      themeBg2Color: ['#f4f5f7', '#02162b'],
    },
    favicon: {
      logo: '/logo.png',
      icon16: '/favicon.ico',
      icon32: '/favicon.ico',
      appleTouchIcon: '/logo.png',
      visibilitychange: true,
    },
    page: {
      index: '/',
      archives: '/archives',
      categories: '/categories',
      tags: '/tags',
    },
    topBars: [
      { title: 'home', url: '/' },
      { title: 'archives', url: '/archives' },
      { title: 'categories', url: '/categories' },
      { title: 'tags', url: '/tags' },
      // { title: 'links', url: '/links' },
      { title: 'about', url: '/about' },
      // { title: 'gallery', url: '/gallery' },
    ],
    outline: {
      level: [2, 6],
      label: '目录列表',
    },
    user: {
      name: `${author}`,
      firstName: 'Chigga',
      lastName: 'Def',
      email: 'defchigga@qq.com',
      /* 友链信息 */
      domain: 'https://www.bing.com',
      // avatar: 'https://foruda.gitee.com/avatar/1677493109319365464/8702488_defchigga_1677493109.png!avatar200',
      avatar: '/avatar.jpg',
      darkAvatar: '/avatar.jpg',
      describe: '记录学习笔记~',
      ruleText:
        '暂不接受个人博客以外的友链申请，确保您的网站内容积极向上，文章至少30篇，原创70%以上，部署HTTPS。',
    },
    sidebar: {
      typedTextPrefix: '',
      typedText: ['just do it！', '就要干 it！'],
      social: [
        {
          name: 'Github',
          url: 'https://github.com/Def-Chigga',
          icon: `<svg t="1768578245097" class="icon" viewBox="0 0 1049 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3573" width="32" height="32"><path d="M524.712986 0q107.255961 0 203.996632 41.009632 94.637613 39.958103 167.193116 112.513606t112.513606 167.193116q41.009632 96.740671 41.009632 203.996632 0 113.565135-46.267277 216.61498-45.215748 99.895258-126.709248 173.50229t-185.594874 108.30749q-17.875994 3.154587-28.391284-5.257645-7.360703-8.412232-7.360703-19.979052v-144.059477q0-34.700458-10.515291-60.988683-9.463761-23.133639-25.236696-36.803516 69.400916-7.360703 114.616664-27.339755 58.885626-26.288226 89.379967-77.813148 36.803516-58.885626 36.803517-153.523239 0-80.967735-54.67951-140.90489 8.412232-21.030581 10.51529-47.318806 3.154587-45.215748-15.772935-92.534555-18.927523-5.257645-56.782568 8.412232-26.288226 9.463761-59.937154 29.442813-27.339755 15.772935-27.339755 16.824465-64.143271-17.875994-131.441129-17.875994t-131.441129 17.875994l-27.339755-16.824465q-33.648929-19.979052-59.937154-29.442813-36.803516-13.669877-56.782568-8.412232-18.927523 47.318806-15.772935 92.534555 2.103058 26.288226 10.51529 47.318806-54.67951 59.937155-54.67951 140.90489 0 94.637613 36.803516 153.523239 30.494342 50.473393 89.379968 77.813148 45.215748 19.979052 113.565135 27.339755-27.339755 25.236697-33.648929 70.452445-35.751987 16.824464-70.452445 13.669877-51.524922-4.206116-82.019264-56.782568-12.618348-22.08211-33.648929-36.803516-14.721406-9.463761-32.5974-14.721406-9.463761-3.154587-14.721406-3.154587-31.545871 0-19.979052 15.772935 5.257645 8.412232 16.824465 16.824465 22.08211 9.463761 42.061161 44.164219 10.51529 16.824464 15.772935 32.5974 13.669877 41.009632 59.937155 57.834097 32.5974 11.566819 78.864677 8.412232 22.08211-1.051529 38.906574-4.206116l1.051529 97.792199q0 11.566819-8.412232 19.979052-10.51529 8.412232-28.391284 5.257645-104.101374-34.700458-185.594874-108.30749T46.267277 741.327966q-46.267277-103.049845-46.267277-216.61498 0-107.255961 41.009632-203.996632 39.958103-94.637613 112.513606-167.193116t167.193116-112.513606q97.7922-41.009632 203.996632-41.009632z m-325.973999 753.946315q2.103058-5.257645-4.731881-7.886468t-8.937997 1.577293q-2.103058 4.206116 4.206116 7.360704 3.154587 2.103058 5.78341 1.577293t3.680352-2.628822z m21.03058 23.133638q2.103058-2.103058 1.577294-5.257645t-3.154587-5.78341q-2.628823-2.628823-5.78341-3.154587t-5.257645 1.051529q-2.103058 1.577294-1.577294 4.731881t3.154587 5.78341q2.628823 2.628823 5.78341 3.680351t5.257645-1.051529z m21.030581 30.494342q2.103058-2.103058 2.103058-5.78341t-2.103058-7.360703q-2.103058-3.680352-5.78341-4.73188t-6.309174 0.525764q-2.628823 1.577294-2.628823 5.257645t2.628823 7.360703q2.628823 3.680352 6.309174 5.257646t5.78341-0.525765z m28.391284 28.391284q2.103058-1.051529 1.051529-5.257645t-4.206116-7.360704q-3.154587-3.154587-7.360704-3.680351t-6.309174 1.577293q-2.103058 2.103058-1.577293 6.309175t4.206116 7.360703q3.680352 3.154587 7.886468 3.680351t6.309174-2.628822z m38.906574 17.875993q1.051529-3.154587-1.577294-6.309174t-6.834938-4.73188q-4.206116-1.577294-8.412233 0t-5.257645 4.73188q-1.051529 3.154587 1.577294 6.309174t6.834938 4.206116q4.206116 1.051529 8.412233 0t5.257645-4.206116z m43.11269 3.154587q0-3.154587-3.680352-5.783409t-8.412232-2.103058q-4.731881 0.525765-7.886468 2.628822t-3.154587 5.257645q0 3.154587 3.680352 5.78341t8.412232 2.103058q4.731881-0.525765 7.886468-2.628822t3.154587-5.257646z m39.958103-7.360703q-1.051529-2.103058-4.73188-4.206116t-8.412233-1.051529q-4.731881 1.051529-7.360703 3.680352t-2.103058 5.783409q0.525765 3.154587 4.206116 5.257646t8.412232 1.051529q4.731881-1.051529 7.360704-4.206117t2.628822-6.309174z" p-id="3574"></path></svg>`,
        },
        {
          name: 'Gitees',
          url: 'https://gitee.com/defchigga',
          icon: `<svg t="1768578129717" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1729" width="32" height="32"><path d="M512 1024q-104 0-199-40-92-39-163-110T40 711Q0 616 0 512t40-199Q79 221 150 150T313 40q95-40 199-40t199 40q92 39 163 110t110 163q40 95 40 199t-40 199q-39 92-110 163T711 984q-95 40-199 40z m259-569H480q-10 0-17.5 7.5T455 480v64q0 10 7.5 17.5T480 569h177q11 0 18.5 7.5T683 594v13q0 31-22.5 53.5T607 683H367q-11 0-18.5-7.5T341 657V417q0-31 22.5-53.5T417 341h354q11 0 18-7t7-18v-63q0-11-7-18t-18-7H417q-38 0-72.5 14T283 283q-27 27-41 61.5T228 417v354q0 11 7 18t18 7h373q46 0 85.5-22.5t62-62Q796 672 796 626V480q0-10-7-17.5t-18-7.5z" p-id="1730"></path></svg>`,
        },
      ],
      info: [
        {
          key: 'residence',
          val: 'mars',
        },
        {
          key: 'city',
          val: 'kunming',
        },
        {
          key: 'age',
          val: String(getAge(1997, 7, 14)),
        },
      ],
    },
    banner: {
      type: 'video', // 'img' | 'video'
      bgurl: `${base}banner-video.mp4`,
      bannerTitle: 'Hello word',
      bannerText: 'Hi my new friend!',
      // ...
    },
    footer: {
      powered: {
        enable: false,
      },
      beian: {
        enable: true,
        icp: '滇ICP备2026011700号-7X',
      },
      copyrightYear: '2026',
      liveTime: {
        enable: true,
        prefix: '博客已萌萌哒运行',
        startTime: '2026/01/17',
      },
    },

    /* 内置页面配置 */
    // 友链
    links: [
      {
        name: 'Vitepress',
        url: 'https://vitepress.dev',
        image: 'https://vitepress.dev/vitepress-logo-mini.svg',
        desc: 'VitePress is a Static Site Generator (SSG) designed for building fast, content-centric websites',
      },
      /*{
        name: '白云苍狗',
        url: 'https://www.imalun.com/',
        image: 'https://www.imalun.com/images/avatar.jpg',
        desc: '醒，亦在人间；梦，亦在人间',
      },*/
    ],
    // 关于
    about: {
      title:
        '如果一切都是镜花水月，那就让这万物走向终结。如果一切皆是命中注定，那就让这世界消失殆尽。',
      introduction: `大家好，我是 <strong>${author}</strong>，很高兴您能在浩瀚如烟的互联网世界里发现这个博客，更感谢您能够饶有兴致地浏览这个页面。建立这个 Blog 是出于兴趣爱好，我将在此分会分享一些学习笔记，可能还会分享少许图片、视频以及其他有趣东西的链接。`,
      blog: `<ul class="trm-list"> <li>程序：Vitepress </li> <li>托管：GitHub </li> </ul>`,
      privacy:
        '本网站不会追踪访客行为，且不要求访客提供任何敏感信息（比如真实姓名、身份证号码、手机号等），因而也不存在任何隐私泄漏问题。访客参与评论，必须遵守法律法规和基本道德规范，文明礼貌。严禁发布任何有关淫秽、反动、暴力、博彩、恐吓、低俗的内容或违法信息，在尊重言论自由的同时请保持和平与理性。请勿对他人采取不友好的评论或其它过激行为。',
    },
    // 404
    notFound: {
      text: '从前有座山，山里有座庙，庙里有个页面，现在找不到...',
    },

    /* 文章详情配置 */
    reward: {
      enable: false,
      methods: [
        { name: '微信', path: '' },
        { name: '支付宝', path: '' },
        { name: 'QQ', path: '' },
      ],
    },
    creativeCommons: {
      license: 'by-nc-sa',
      language: 'deed.zh-hans',
      post: true, // 在每篇文章末尾显示
      clipboard: false, // 是否在复制文章时，在剪贴板中追加版权信息
    },
    postPagination: {
      enable: true,
      type: 'small', // 'large' | 'small'
    },
    cover: {
      type: 'img', // 'img' | 'date' | 'random'
      default: '',
    },
    noticeOutdate: {
      enable: true,
      style: 'flat', // 'simple' | 'flat'
      limitDay: 365,
      position: 'top',
    },
    /*errorImg: {
      flink: '',
      postPage: ''
    },*/

    /* 其它配置 */
    rightside: {
      readmode: true,
      aside: true,
    },
    indexGenerator: {
      // perPage: 10,
      // orderBy: '',
      static: true,
    },
    archiveGenerator: {
      style: 'less', // less | more
      static: true,
    },
    categorieCard: {
      enable: true,
      len: 2,
      list: [/*'Git', 'AI', */ '前端', '后端' /*'数据库', '运维', '工具', '其它'*/],
    },
    search: {
      provider: 'local',
      options: {
        locales: {
          zh: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档',
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换',
                },
              },
            },
          },
        },
      },
    },
    pageLoading: true,
    themeLoading: true,
    author,
  },

  /* Vite 配置 */
  vite: {
    build: {
      minify: 'terser', // 确保使用 Terser 进行压缩
      terserOptions: {
        compress: {
          drop_console: true, // 移除所有 console.*
          drop_debugger: true, // 如果需要，也可以一并移除 debugger 语句
        },
      },
    },
  },
})
