"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
    AlertTriangle, 
    Calendar, 
    ChevronLeft, 
    ChevronRight, 
    Filter, 
    LayoutList, 
    Search,
    User
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const logsData = [
    { id: 1, timestamp: "Oct 24, 10:42:05", actor: { name: "John Doe", id: "user_8821" }, tenant: "Acme Corp", action: "CREATE", resource: "invoice_2024_001", ip: "192.168.1.42", status: "Success" },
    { id: 2, timestamp: "Oct 24, 10:41:12", actor: { name: "Sys Admin", id: "admin_001" }, tenant: "System", action: "UPDATE", resource: "global_settings", ip: "10.0.0.5", status: "Success" },
    { id: 3, timestamp: "Oct 24, 10:38:55", actor: { name: "Unknown", id: "session_null" }, tenant: "Beta LLC", action: "LOGIN", resource: "auth_portal", ip: "45.22.19.112", status: "Failed" },
    { id: 4, timestamp: "Oct 24, 09:15:30", actor: { name: "Mike K.", id: "user_992" }, tenant: "Acme Corp", action: "DELETE", resource: "product_sku_882", ip: "192.168.1.42", status: "Success" },
    { id: 5, timestamp: "Oct 24, 08:55:01", actor: { name: "Jane Smith", id: "user_102" }, tenant: "Gamma Inc", action: "UPDATE", resource: "billing_profile", ip: "201.55.90.21", status: "Success" },
    { id: 6, timestamp: "Oct 24, 08:30:15", actor: { name: "John Doe", id: "user_8821" }, tenant: "Acme Corp", action: "EXPORT", resource: "report_finance_q3", ip: "192.168.1.42", status: "Success" },
];

export function LogsTable() {
  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-card border rounded-lg">
         <div className="md:col-span-1 relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by User ID, IP, or Resource" className="pl-8 bg-background" />
         </div>
         <div className="md:col-span-1">
            <Select>
                <SelectTrigger className="bg-background">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <SelectValue placeholder="Last 24 Hours" />
                    </div>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="24h">Last 24 Hours</SelectItem>
                    <SelectItem value="7d">Last 7 Days</SelectItem>
                    <SelectItem value="30d">Last 30 Days</SelectItem>
                </SelectContent>
            </Select>
         </div>
         <div className="md:col-span-1">
            <Select>
                <SelectTrigger className="bg-background">
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                        <SelectValue placeholder="Severity" />
                    </div>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Severities</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                </SelectContent>
            </Select>
         </div>
         <div className="md:col-span-1">
            <Select>
                <SelectTrigger className="bg-background">
                    <div className="flex items-center gap-2">
                        <LayoutList className="h-4 w-4 text-muted-foreground" />
                        <SelectValue placeholder="Action Type" />
                    </div>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Actions</SelectItem>
                    <SelectItem value="create">Create</SelectItem>
                    <SelectItem value="update">Update</SelectItem>
                    <SelectItem value="delete">Delete</SelectItem>
                    <SelectItem value="login">Login</SelectItem>
                </SelectContent>
            </Select>
         </div>
      </div>

      {/* Table */}
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead>Actor</TableHead>
              <TableHead>Tenant</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Resource</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logsData.map((log) => (
              <TableRow key={log.id}>
                <TableCell>
                   <Button variant="ghost" size="icon" className="h-6 w-6">
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                   </Button>
                </TableCell>
                <TableCell className="font-mono text-sm">{log.timestamp}</TableCell>
                <TableCell>
                    <div className="flex items-center gap-2">
                        <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold ${log.actor.name === 'Unknown' ? 'bg-muted text-muted-foreground' : 'bg-primary/10 text-primary'}`}>
                            {log.actor.name === 'Unknown' ? '?' : log.actor.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-medium">{log.actor.name}</span>
                            <span className="text-xs text-muted-foreground">{log.actor.id}</span>
                        </div>
                    </div>
                </TableCell>
                <TableCell>{log.tenant}</TableCell>
                <TableCell>
                    <Badge variant="outline" className={`font-mono
                        ${log.action === 'CREATE' ? 'text-emerald-500 border-emerald-500/20 bg-emerald-500/10' : ''}
                        ${log.action === 'DELETE' ? 'text-red-500 border-red-500/20 bg-red-500/10' : ''}
                        ${log.action === 'UPDATE' ? 'text-blue-500 border-blue-500/20 bg-blue-500/10' : ''}
                        ${log.action === 'LOGIN' ? 'text-amber-500 border-amber-500/20 bg-amber-500/10' : ''}
                        ${log.action === 'EXPORT' ? 'text-purple-500 border-purple-500/20 bg-purple-500/10' : ''}
                    `}>
                        {log.action}
                    </Badge>
                </TableCell>
                <TableCell className="font-mono text-sm text-muted-foreground">{log.resource}</TableCell>
                <TableCell className="font-mono text-sm text-muted-foreground">{log.ip}</TableCell>
                <TableCell>
                    <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${log.status === 'Success' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        <span className={`text-sm ${log.status === 'Success' ? 'text-emerald-500' : 'text-red-500'}`}>{log.status}</span>
                    </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between p-4 bg-card border rounded-lg">
         <div className="text-sm text-muted-foreground">
            Showing <span className="font-medium text-foreground">1</span> to <span className="font-medium text-foreground">10</span> of <span className="font-medium text-foreground">14,203</span> results
         </div>
         <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled><ChevronLeft className="h-4 w-4" /></Button>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0 bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground">1</Button>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">2</Button>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">3</Button>
            <span className="text-muted-foreground">...</span>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">1,420</Button>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0"><ChevronRight className="h-4 w-4" /></Button>
         </div>
      </div>
    </div>
  );
}
