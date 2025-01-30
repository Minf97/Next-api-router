import * as fs from 'fs';
import * as path from 'path';
import { MethodInfo } from '../models/MethodInfo';

export function isNextJsProject(projectRoot: string): boolean {
  try {
    const packageJsonPath = path.join(projectRoot, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    return !!(packageJson.dependencies?.next || packageJson.devDependencies?.next);
  } catch {
    return false;
  }
}

export function isApiFile(fileName: string): boolean {
  return /\.(ts|js|tsx|jsx)$/.test(fileName) && !fileName.includes('.d.ts');
}

export function isRouteFile(fileName: string): boolean {
  return /^route\.(ts|js|tsx|jsx)$/.test(fileName);
}

export function formatApiPath(routePath: string, dirType: 'app' | 'pages'): string {
  let apiPath = routePath.replace(/\\/g, '/');
  if (dirType === 'app') {
    apiPath = apiPath.replace(/^\/?app/, '').replace(/\/route$/, '');
  } else {
    apiPath = apiPath.replace(/\.(ts|js|tsx|jsx)$/, '');
  }
  return apiPath || '/';
}

export async function detectHttpMethods(filePath: string): Promise<MethodInfo[]> {
  try {
    const content = await fs.promises.readFile(filePath, 'utf8');
    const lines = content.split('\n');
    const methodInfos: MethodInfo[] = [];
    // console.log(lines, "lines");
    const httpMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
    
    lines.forEach((line, index) => {
      console.log(line.includes(`export const ${'GET'}`), line,"line");
      
      httpMethods.forEach(method => {
        if (
          line.includes(`export async function ${method}`) ||
          line.includes(`export function ${method}`) ||
          line.includes(`handler.${method}`) ||
          line.includes(`export const ${method}`)
        ) {
          methodInfos.push({ method, line: index });
        }
      });
    });
    
    return methodInfos.length ? methodInfos : [{ method: 'GET', line: 0 }];
  } catch {
    return [{ method: 'GET', line: 0 }];
  }
} 