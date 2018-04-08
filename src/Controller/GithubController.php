<?php

namespace App\Controller;

use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class GithubController extends Controller {

    /**
     * @Route("/github", name="github_homepage", methods={"GET"})
     */
    public function index() {
        return $this->render('github/index.html.twig');
    }

    /**
     * @Route("/github/{username}/repos", name="show_repos", methods={"GET"})
     */
    public function showUserRepos($username) {
        $url = 'https://api.github.com/users/' . $username . '/repos';

    }
}
