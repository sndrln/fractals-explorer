export function processShader(
  source: string,
  library: Record<string, string>,
): string {
  // Regex to find: #include "./path/file.glsl"
  const includeRegex = /#include\s+"([^"]+)"/g;

  return source.replace(includeRegex, (_match, path) => {
    // Extract the filename from the path (e.g., "./shared/complex_math.glsl" -> "complex_math")
    const fileName = path.split("/").pop()?.replace(".glsl", "");

    if (fileName && library[fileName]) {
      // Recursively process includes in the included file
      return processShader(library[fileName], library);
    }

    console.warn(`ShaderLoader: Could not find include for ${path}`);
    return `// Include failed: ${path}`;
  });
}
