import * as vscode from 'vscode';
import { NextApiTreeProvider } from './providers/NextApiTreeProvider';

export function activate(context: vscode.ExtensionContext) {
  // 创建视图容器
  const nextApiProvider = new NextApiTreeProvider();
  const treeView = vscode.window.createTreeView('nextApiExplorer', {
    treeDataProvider: nextApiProvider,
    showCollapseAll: true
  });

  // 注册刷新命令
  let refreshCommand = vscode.commands.registerCommand('nextApiExplorer.refresh', () => {
    nextApiProvider.refresh();
  });

  // 注册跳转命令
  let gotoCommand = vscode.commands.registerCommand('nextApiExplorer.gotoFile', async (filePath: string, methodLine?: number) => {
    const doc = await vscode.workspace.openTextDocument(filePath);
    const editor = await vscode.window.showTextDocument(doc);
    if (methodLine !== undefined) {
      const position = new vscode.Position(methodLine, 0);
      editor.selection = new vscode.Selection(position, position);
      editor.revealRange(new vscode.Range(position, position));
    }
  });

  context.subscriptions.push(refreshCommand, gotoCommand);
}