import * as vscode from 'vscode';

export class ApiItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly filePath: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly methods: string[] = ['GET'],
    public readonly methodLine?: number,
    public readonly children: ApiItem[] = [],
    public readonly isDirectory: boolean = false
  ) {
    super(label, collapsibleState);
    
    if (isDirectory) {
      // 如果是目录，使用文件夹图标
      this.iconPath = new vscode.ThemeIcon('folder');
      this.tooltip = this.label;
      this.description = '';
    } else {
      // 如果是文件，使用链接图标并保持原有行为
      this.iconPath = new vscode.ThemeIcon('link');
      this.tooltip = `🚀 ${methods.join(', ')}\n${this.filePath}`;
      //  TODO：可以扫描 JSDoc 添加对该方法的描述
      // this.description = `[${methods.join(', ')}]`;
      this.command = {
        command: 'nextApiExplorer.gotoFile',
        title: 'Go to File',
        arguments: [this.filePath, this.methodLine]
      };
    }
  }
} 