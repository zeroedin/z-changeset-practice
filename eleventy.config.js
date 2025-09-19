import { Liquid } from "liquidjs";

export default async function(eleventyConfig) {
	eleventyConfig.setInputDirectory("docs");
	eleventyConfig.setOutputDirectory("_site");
  eleventyConfig.addPassthroughCopy("docs/images/*");
  eleventyConfig.addPassthroughCopy("docs/scripts/**/*.js");
  eleventyConfig.addPassthroughCopy("docs/releases.json");

  const options = {
    jsTruthy: true,
    dynamicPartials: true,
    strictFilters: false,
    extensions: [".liquid", ".html"],
    root: ["./docs"],
  };

  eleventyConfig.addGlobalData("env", process.env.ELEVENTY_ENV);
  eleventyConfig.setLibrary("liquid", new Liquid(options));
};