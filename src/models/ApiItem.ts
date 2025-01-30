import * as vscode from 'vscode';
import * as path from 'path';

export class ApiItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly filePath: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly methods: string[] = ['GET'],
    public readonly methodLine?: number
  ) {
    super(label, collapsibleState);
    this.tooltip = `${this.label}\n${this.filePath}\n方法: ${methods.join(', ')}`;
    this.description = `[${methods.join(', ')}] ${path.basename(path.dirname(filePath))}`;
    this.command = {
      command: 'nextApiExplorer.gotoFile',
      title: 'Go to File',
      arguments: [this.filePath, this.methodLine]
    };
  }

  iconPath = new vscode.ThemeIcon('link');
} 