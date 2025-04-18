import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "../components/ui/card";
  import { Button } from "../components/ui/button";
  import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
  import { Edit, Trash2 } from "lucide-react";
  import { motion } from "framer-motion";
  
  const showsData = [
    {
      id: 1,
      movie: "Jawan",
      theater: "Cineplex 1",
      showTime: "2:00 PM",
      date: "2025-04-18",
    },
    {
      id: 2,
      movie: "Dune 2",
      theater: "PVR Infinity",
      showTime: "6:30 PM",
      date: "2025-04-18",
    },
    {
      id: 3,
      movie: "Animal",
      theater: "INOX City Center",
      showTime: "9:00 PM",
      date: "2025-04-18",
    },
  ];
  
  const ManageShows = () => {
    return (
      <div className="p-6">
        <motion.h2
          className="text-2xl font-bold mb-6 text-gray-800"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          🎥 Manage All Shows
        </motion.h2>
  
        <Card className="border border-gray-200 shadow-md">
          <CardHeader>
            <CardTitle className="text-gray-700">All Shows List</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Movie</TableHead>
                  <TableHead>Theater</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {showsData.map((show) => (
                  <TableRow key={show.id} className="hover:bg-gray-50">
                    <TableCell>{show.movie}</TableCell>
                    <TableCell>{show.theater}</TableCell>
                    <TableCell>{show.showTime}</TableCell>
                    <TableCell>{show.date}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button size="sm" variant="outline" className="text-blue-600">
                        <Edit className="w-4 h-4 mr-1" /> Edit
                      </Button>
                      <Button size="sm" variant="destructive">
                        <Trash2 className="w-4 h-4 mr-1" /> Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  };
  
  export default ManageShows;
  