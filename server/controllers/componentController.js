import Component from '../models/Component.js'


export const addComponent= async(req,res)=>{

    try{

        const {name,category,description,totalQuantity,location}= req.body;

        const newComponent= await Component.create({
            name,
            category,
            description,
            totalQuantity,
            quantityAvailable:totalQuantity,
            location
        });

        res.status(201).json(newComponent);

    }catch(err){
        res.status(500).json({message:err.message});

    }
}


export const getComponents= async (req,res)=>{

    try{
        const components= await Component.find();
        res.json(components);


    }catch(err){
        res.status(500).json({message:err.message});

    }
}

export const updateComponent=async (req,res)=>{

    try{

         const {id}= req.params;
         const updates= {...req.body};

          if (updates.totalQuantity !== undefined) {
      updates.quantityAvailable = updates.totalQuantity;
    }

       const updated = await Component.findByIdAndUpdate(id, updates, { new: true });
         if (!updated) return res.status(404).json({ message: "Component not found" });
        res.json({message: "Component updated successfully",updated});


    }catch (err) {
    res.status(500).json({ message: err.message });
  }
   
};

export const deleteComponent= async (req,res)=>{

    try{

        await Component.findByIdAndDelete(req.params.id);
        res.json({message:"Component Deleted"});

    }catch(err){
        res.status(500).json({message:err.message});

    }
}

export const getComponentById=async (req,res)=>{

    try{
        const component= await Component.findById(req.params.id);
        if(!component) return res.status(404).json({message:"Component not found"});
        res.json(component);

    } catch (err) {
    res.status(500).json({ message: err.message });
  }
};