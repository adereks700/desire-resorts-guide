import CleanCSS from "clean-css";
import esbuild from "esbuild";
import fs from "fs";
import path from "path";

export default function(eleventyConfig) {
  // Passthrough copy
  eleventyConfig.addPassthroughCopy({ "src/img": "img" });
  eleventyConfig.addPassthroughCopy({ "src/manifest.json": "manifest.json" });
   eleventyConfig.addPassthroughCopy({ "src/.htaccess": ".htaccess" });
   eleventyConfig.addPassthroughCopy({ "src/_redirects": "_redirects" });
   eleventyConfig.addPassthroughCopy({ "src/vercel.json": "vercel.json" });
  eleventyConfig.addPassthroughCopy({ "src/css/brevo.css": "css/brevo.css" });

  // Watch targets
  eleventyConfig.addWatchTarget("src/css/");
  eleventyConfig.addWatchTarget("src/js/");

  // Build hook for CSS minification and JS bundling
  eleventyConfig.on("eleventy.after", async () => {
    // 1. Minify CSS
    const cssInputPath = path.resolve("src/css/main.css");
    const cssOutputDir = path.resolve("_site/css");
    const cssOutputPath = path.join(cssOutputDir, "main.css");

    if (fs.existsSync(cssInputPath)) {
      if (!fs.existsSync(cssOutputDir)) {
        fs.mkdirSync(cssOutputDir, { recursive: true });
      }
      const rawCss = fs.readFileSync(cssInputPath, "utf8");
      const minified = new CleanCSS({ level: 2 }).minify(rawCss);
      fs.writeFileSync(cssOutputPath, minified.styles);
      const cssSize = (fs.statSync(cssOutputPath).size / 1024).toFixed(2);
      console.log(`[CSS] Minified to ${cssSize} KB`);
    }

    // 2. Minify JS
    // Templates load individual files (e.g. /js/nav.js, /js/booking-widget.js,
    // /js/quiz.js) rather than a single bundle, so each referenced file is
    // minified in place under the same name. index.js is an aggregator only
    // (used for local dev imports) and is not linked from any page, so it's
    // skipped here.
    const jsInputDir = path.resolve("src/js");
    const jsOutputDir = path.resolve("_site/js");

    if (fs.existsSync(jsInputDir)) {
      if (!fs.existsSync(jsOutputDir)) {
        fs.mkdirSync(jsOutputDir, { recursive: true });
      }
      const jsFiles = fs.readdirSync(jsInputDir).filter(
        (f) => f.endsWith(".js") && f !== "index.js"
      );
      let totalSize = 0;
      for (const file of jsFiles) {
        const outfile = path.join(jsOutputDir, file);
        await esbuild.build({
          entryPoints: [path.join(jsInputDir, file)],
          outfile,
          bundle: false,
          minify: true,
          target: ["es2020"],
          sourcemap: false
        });
        totalSize += fs.statSync(outfile).size;
      }
      console.log(`[JS] Minified ${jsFiles.length} files to ${(totalSize / 1024).toFixed(2)} KB total`);
    }
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    templateFormats: ["njk", "md", "html"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk"
  };
}
