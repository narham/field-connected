import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Target } from "lucide-react";

const standings = [
  { pos: 1, team: "SSB Garuda Muda", mp: 4, w: 3, d: 1, l: 0, gf: 10, ga: 3, gd: 7, pts: 10 },
  { pos: 2, team: "SSB Rajawali", mp: 4, w: 2, d: 1, l: 1, gf: 7, ga: 5, gd: 2, pts: 7 },
  { pos: 3, team: "SSB Bintang Timur", mp: 4, w: 1, d: 2, l: 1, gf: 5, ga: 5, gd: 0, pts: 5 },
  { pos: 4, team: "SSB Elang Jaya", mp: 4, w: 1, d: 1, l: 2, gf: 4, ga: 6, gd: -2, pts: 4 },
  { pos: 5, team: "SSB Mitra Bola", mp: 4, w: 0, d: 1, l: 3, gf: 2, ga: 9, gd: -7, pts: 1 },
];

const topScorers = [
  { pos: 1, name: "Ahmad Fauzi", team: "SSB Garuda Muda", goals: 6 },
  { pos: 2, name: "Rizki Pratama", team: "SSB Rajawali", goals: 4 },
  { pos: 3, name: "Deni Saputra", team: "SSB Bintang Timur", goals: 3 },
  { pos: 4, name: "Farhan Hidayat", team: "SSB Elang Jaya", goals: 3 },
  { pos: 5, name: "Gilang Maulana", team: "SSB Garuda Muda", goals: 2 },
];

const EOStandings = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Klasemen & Statistik</h1>
        <p className="text-muted-foreground text-sm mt-1">Liga Grassroots Jakarta U-12</p>
      </div>

      <Tabs defaultValue="standings">
        <TabsList>
          <TabsTrigger value="standings" className="gap-1">
            <Trophy className="w-3.5 h-3.5" /> Klasemen
          </TabsTrigger>
          <TabsTrigger value="scorers" className="gap-1">
            <Target className="w-3.5 h-3.5" /> Top Scorer
          </TabsTrigger>
        </TabsList>

        <TabsContent value="standings">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10">#</TableHead>
                    <TableHead>Tim</TableHead>
                    <TableHead className="text-center">Main</TableHead>
                    <TableHead className="text-center">M</TableHead>
                    <TableHead className="text-center">S</TableHead>
                    <TableHead className="text-center">K</TableHead>
                    <TableHead className="text-center">SG</TableHead>
                    <TableHead className="text-center font-bold">Poin</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {standings.map((s) => (
                    <TableRow key={s.pos}>
                      <TableCell className="font-bold text-center">
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs ${
                          s.pos <= 2 ? "bg-primary text-primary-foreground" : ""
                        }`}>
                          {s.pos}
                        </span>
                      </TableCell>
                      <TableCell className="font-medium">{s.team}</TableCell>
                      <TableCell className="text-center text-muted-foreground">{s.mp}</TableCell>
                      <TableCell className="text-center text-primary font-medium">{s.w}</TableCell>
                      <TableCell className="text-center text-muted-foreground">{s.d}</TableCell>
                      <TableCell className="text-center text-destructive">{s.l}</TableCell>
                      <TableCell className="text-center text-muted-foreground">{s.gd > 0 ? `+${s.gd}` : s.gd}</TableCell>
                      <TableCell className="text-center font-bold text-foreground">{s.pts}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scorers">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10">#</TableHead>
                    <TableHead>Pemain</TableHead>
                    <TableHead>Tim</TableHead>
                    <TableHead className="text-center">Gol</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topScorers.map((s) => (
                    <TableRow key={s.pos}>
                      <TableCell className="text-center font-bold">
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs ${
                          s.pos === 1 ? "bg-accent text-accent-foreground" : ""
                        }`}>
                          {s.pos}
                        </span>
                      </TableCell>
                      <TableCell className="font-medium">{s.name}</TableCell>
                      <TableCell className="text-muted-foreground">{s.team}</TableCell>
                      <TableCell className="text-center font-bold text-foreground">{s.goals}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EOStandings;
