require('dotenv').config();
const express = require("express")
const bodyParser = require("body-parser")
const ejs = require("ejs");
const date = require(__dirname + "/date-v2.js");
const mongoose = require("mongoose");
const lodash = require("lodash");


const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");


mongoose.connect(process.env.CONNECT_URL, { useNewUrlParser: true });


const itemsSchema = {
    name: {
        type: String,
        required: [true, "Enter a task please."]
    }
}
const Item = mongoose.model("Item", itemsSchema);



const item1 = new Item({
    name: "Welcome to your todolist."
})
const item2 = new Item({
    name: "Hit the + button to add a new item."
})
const item3 = new Item({
    name: "<-- Hit this to delete an item."
})
const defaultItems = [item1, item2, item3];




const listSchema = {
    name: String,
    items: [itemsSchema]
};
const List = mongoose.model("List", listSchema);



app.get("/", function (req, res) {

    // const day = date.getDate();

    Item.find({}, function (err, foundItems) {
        if (foundItems.length === 0) {
            Item.insertMany(defaultItems, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("defaultItems inserted in DB successfully");
                }
            });
        }

        res.render("list", { listTitle: "Today", newListItems: foundItems  });
    })
})


app.get("/about", function (req, res) {
    res.render("about");
})
app.get("/tips", function (req, res) {
    res.render("tips");
})


app.get("/:customListName", function (req, res) {
    const customListName = lodash.capitalize(req.params.customListName);

    List.findOne({ name: customListName }, function (err, foundList) {
        if (!err) {
            if (!foundList) {
                const itemName = req.body.newItem;

                const list = new List({
                    name: customListName,
                    items: defaultItems
                });

                list.save();
                res.redirect("/" + customListName);
            } else {
                res.render("list", { listTitle: foundList.name, newListItems: foundList.items });
            }
        }
    })
});


app.post("/", function (req, res) {

    const itemName = req.body.newItem;
    const listName = req.body.list;

    const item = new Item({ name: itemName });

    

    if (listName === "Today") {
        
        if (itemName === "") {
            res.redirect("/");
        }

        item.save(function(err) {
            if (!err) {
                res.redirect("/");
            }
        });
        
    } else {
        if (itemName === "") {
            res.redirect("/"+listName);
        }
        List.findOne({ name: listName }, function (err, foundList) {
            foundList.items.push(item);
            foundList.save(function (err) {
                if (!err) {
                    res.redirect("/" + listName);
                }
            });
           
        })

       List.findOneAndDelete({ name: "Favicon.ico" })
    }

});


app.post("/delete", function (req, res) {
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;

    if (listName === "Today") {
        Item.findByIdAndRemove(checkedItemId, function (err) {
            if (!err) {
                console.log("Successfully deleted the checked item.");
                res.redirect("/");
            }
        });
    } else {

        List.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: checkedItemId } } }, function (err, foundList) {
            if (!err) {
                res.redirect("/" + listName);
            }
        })
    }


})



app.listen(process.env.PORT || 3000, function () {          
    console.log("Server started at port 3000");
})