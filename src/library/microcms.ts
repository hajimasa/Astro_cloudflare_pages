import { createClient, MicroCMSQueries } from "microcms-js-sdk";
// const client = createClient({
//   serviceDomain: import.meta.env.MICROCMS_SERVICE_DOMAIN,
//   apiKey: import.meta.env.MICROCMS_API_KEY,
// });

// Cloudflare Pages SSR用関数
import { getRuntime } from "@astrojs/cloudflare/runtime";
const generateClient = (request: Request) => {
  // runtimeの中にはenvの他、KVなど他のサービスなどがコンテキストとして入ってくる
  const runtime = getRuntime(request);
  //@ts-expect-error envの型は適宜調整
  const { MICROCMS_SERVICE_DOMAIN, MICROCMS_API_KEY } = runtime.env;
  return createClient({
    serviceDomain: MICROCMS_SERVICE_DOMAIN,
    apiKey: MICROCMS_API_KEY,
  });
};

export type Blog = {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
  title: string;
  content: string;
  eyecatch: {
    url: string;
    height: number;
    width: number;
  };
};
export type BlogResponse = {
  totalCount: number;
  offset: number;
  limit: number;
  contents: Blog[];
};
// class CMSBlog {
//   @Cache(userCache, { ttl: 300 })
export const getBlogs = async (request: Request, queries?: MicroCMSQueries) => {
  // public async getBlogs(queries?: MicroCMSQueries){
  // const client = clientFactoryFunction();
  const client = generateClient(request);
  const data = await client.get<BlogResponse>({ endpoint: "blogs", queries });

  if (data.offset + data.limit < data.totalCount) {
    queries ? (queries.offset = data.offset + data.limit) : "";
    const result: BlogResponse = await getBlogs(request, queries);
    return {
      offset: result.offset,
      limit: result.limit,
      contents: [...data.contents, ...result.contents],
      totalCount: result.totalCount,
    };
  }
  return data;
};

export const getBlogDetail = async (
  request: Request,
  contentId: string,
  queries?: MicroCMSQueries
) => {
  const client = generateClient(request);
  return await client.getListDetail<Blog>({
    endpoint: "blogs",
    contentId,
    queries,
  });
};
// };
// export const cmsBlog = new CMSBlog();