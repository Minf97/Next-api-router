import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { ApiItem } from '../models/ApiItem';
import { isNextJsProject, isApiFile, isRouteFile, formatApiPath, detectHttpMethods } from '../utils/fileUtils';

export class NextApiTreeProvider implements vscode.TreeDataProvider<ApiItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<ApiItem | undefined | null | void> = new vscode.EventEmitter<ApiItem | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<ApiItem | undefined | null | void> = this._onDidChangeTreeData.event;

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: ApiItem): vscode.TreeItem {
    return element;
  }

  async getChildren(element?: ApiItem): Promise<ApiItem[]> {
    if (!element) {
      const workspaceFolders = vscode.workspace.workspaceFolders;
      if (!workspaceFolders) return [];

      const projectRoot = workspaceFolders[0].uri.fsPath;
      if (!isNextJsProject(projectRoot)) {
        vscode.window.showInformationMessage('当前项目不是 Next.js 项目');
        return [];
      }

      return this.scanApiRoutes(projectRoot);
    }
    return [];
  }

  private async scanApiRoutes(projectRoot: string): Promise<ApiItem[]> {
    const apiItems: ApiItem[] = [];
    const appDir = path.join(projectRoot, 'src/app');
    const pagesDir = path.join(projectRoot, 'pages', 'api');

    if (fs.existsSync(appDir)) {
      await this.scanAppDirectory(appDir, apiItems);
    }
    
    if (fs.existsSync(pagesDir)) {
      await this.scanPagesDirectory(pagesDir, apiItems);
    }

    if (apiItems.length === 0) {
      vscode.window.showInformationMessage('未找到 API 路由文件');
    }

    return apiItems;
  }

  private async scanAppDirectory(dir: string, apiItems: ApiItem[], routePath: string = ''): Promise<void> {
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
          await this.scanAppDirectory(fullPath, apiItems, path.join(routePath, entry.name));
        } else if (isRouteFile(entry.name)) {
          const apiPath = formatApiPath(routePath, 'app');
          const methodInfos = await detectHttpMethods(fullPath);
          
          methodInfos.forEach(({ method, line }) => {
            apiItems.push(new ApiItem(
              `${apiPath || '/'} [${method}]`,
              fullPath,
              vscode.TreeItemCollapsibleState.None,
              [method],
              line
            ));
          });
        }
      }
    } catch (error) {
      console.error(`扫描目录失败: ${dir}`, error);
    }
  }

  private async scanPagesDirectory(dir: string, apiItems: ApiItem[], routePath: string = ''): Promise<void> {
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
          await this.scanPagesDirectory(fullPath, apiItems, path.join(routePath, entry.name));
        } else if (isApiFile(entry.name)) {
          const apiPath = formatApiPath(routePath, 'pages');
          const methodInfos = await detectHttpMethods(fullPath);
          
          methodInfos.forEach(({ method, line }) => {
            apiItems.push(new ApiItem(
              `${apiPath || '/'} [${method}]`,
              fullPath,
              vscode.TreeItemCollapsibleState.None,
              [method],
              line
            ));
          });
        }
      }
    } catch (error) {
      console.error(`扫描目录失败: ${dir}`, error);
    }
  }
} 