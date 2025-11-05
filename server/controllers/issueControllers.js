import Issue from '../models/Issue.js';
import Component from '../models/Component.js';

export const issueComponent= async (req,res)=>{

    try{
        const{studentId,componentId,quantityIssued}= req.body;

        const component= await Component.findById(componentId);
        if(!component) return res.status(404).json({message:"Component Not Found"});

        if(component.quantityAvailable< quantityIssued){
            return res.status(400).json({message:"Not enough quantity available"});

        }

        component.quantityAvailable -= quantityIssued;

        await component.save();

        const issue= await Issue.create({
            studentId,
            componentId,
            quantityIssued,
            issuedBy:req.user.id,
        })

        res.status(201).json(issue);


    }catch(err){
        res.status(500).json({ message: err.message });

    }
}


//get all issues for admin only

export const getAllIssues= async (req,res)=>{

    try{
        const issues= await Issue.find()
        .populate("studentId","name email rollNo")
        .populate("componentId","name category")

        res.json(issues);



    }catch (err) {
    res.status(500).json({ message: err.message });
  }
}


//get issues for a student 
export const getStudentIssues= async (req,res)=>{

    try{
        const {id}= req.params;
        const issues= await Issue.find({studentId:id})
        .populate("componentId","name category");

        res.json(issues);


    } catch (err) {
    res.status(500).json({ message: err.message });
  }

}


//mark as returned

export const markAsReturned= async (req,res)=>{

    try{
        const issue= await Issue.findById(req.params.id);
        if(!issue) return res.status(404).json({message:"Issue not found"});

        if(issue.status ==="Returned"){
            return res.status(400).json({message:"This issue is already being mark as returned"});
        }

        //restore component stock
        const component= await Component.findById(issue.componentId);
        if(!component)
            return res.status(400).jaon({message:"Component not found"});


        component.quantityAvailable += issue.quantityIssued;

         if (component.quantityAvailable > component.totalQuantity) {
        component.quantityAvailable = component.totalQuantity;
        }

        await component.save();

        issue.status="Returned";
        issue.dateReturned= new Date;
        await issue.save();

        res.json({message:"Mark as returned",issue});

    } catch (err) {
    res.status(500).json({ message: err.message });
  }
}