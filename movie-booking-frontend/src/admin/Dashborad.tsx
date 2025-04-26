import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "../components/ui/card";
  import {
    IndianRupee,
    Video,
    Theater,
    CalendarDays,
    BarChartBig,
  } from "lucide-react";
  import { motion } from "framer-motion";
  import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
  } from "recharts";
  
  const stats = [
    {
      title: "Total Income",
      value: "₹1,24,000",
      icon: <IndianRupee className="h-6 w-6 text-green-600" />,
    },
    {
      title: "Total Movies",
      value: "32",
      icon: <Video className="h-6 w-6 text-blue-600" />,
    },
    {
      title: "Total Theaters",
      value: "12",
      icon: <Theater className="h-6 w-6 text-purple-600" />,
    },
    {
      title: "Total Bookings",
      value: "198",
      icon: <CalendarDays className="h-6 w-6 text-orange-500" />,
    },
  ];
  
  const chartData = [
    { name: "Mon", bookings: 30 },
    { name: "Tue", bookings: 45 },
    { name: "Wed", bookings: 60 },
    { name: "Thu", bookings: 40 },
    { name: "Fri", bookings: 80 },
    { name: "Sat", bookings: 95 },
    { name: "Sun", bookings: 70 },
  ];
  
  const Dashboard = () => {
    return (
      <div className="p-6 bg-gradient-to-b from-gray-50 to-white min-h-screen">
        <motion.h1
          className="text-4xl font-extrabold text-gray-800 mb-10"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          🎬 Admin Dashboard Overview
        </motion.h1>
  
        <motion.div
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {stats.map((stat) => (
            <Card
              key={stat.title}
              className="shadow-lg hover:shadow-2xl transition-all border border-gray-100 bg-white rounded-2xl"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  {stat.title}
                </CardTitle>
                {stat.icon}
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">
                  {stat.value}
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>
  
        <motion.div
          className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <div className="flex items-center mb-4">
            <BarChartBig className="text-blue-600 w-6 h-6 mr-2" />
            <h2 className="text-lg font-semibold text-gray-700">
              Weekly Booking Stats
            </h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip />
              <Bar dataKey="bookings" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
  
        <footer className="text-center text-gray-400 text-sm mt-10">
          Built with ❤️ by Lalit Khairnar
        </footer>
      </div>
    );
  };
  
  export default Dashboard;
  