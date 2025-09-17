import { Liquid } from "liquidjs";

export default async function(eleventyConfig) {
	eleventyConfig.setInputDirectory("docs");
	eleventyConfig.setOutputDirectory("_site");

  const options = {
    jsTruthy: true,
    dynamicPartials: true,
    strictFilters: false,
    extensions: [".liquid", ".html"],
    root: ["./docs"],
  };

  eleventyConfig.setLibrary("liquid", new Liquid(options));
};